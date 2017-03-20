import json
import logging

import requests

from flindt.role.models import Role
from flindt.user.models import User

from .models import RoleImportRun

logger = logging.getLogger(__name__)


class GlassFrogImporter(object):
    """
    GlassFrogImporter can be used to import users and roles from GlassFrog.

    To import all users, use `import_users`.
    To import all roles, user `import_circles` with the circle_id, for the
    anchor_circle.
    """
    API_BASE_URL = 'https://glassfrog.holacracy.org/api/v3/'

    def __init__(self, api_key, organization=None):

        self.api_key = api_key
        self.organization = organization

        self.import_run = RoleImportRun.objects.create()

        self._circles_cached = None
        self._roles_cached = None

    def import_users(self):
        """
        Create a user for every user found in GlassFrog. If a user with the
        same information is already in the DB, don't create it again.

        Example JSON Response:

            {"people": [{"email": "joris.engbers@wearespindle.com",
                "external_id": None,
                "id": 17466,
                "links": {"circles": [9550, 7210, 3943, 15171, 5338, 14335, 8650]},
                "name": "Joris Engbers"},
                ...
                ...
                ...
            ]}
        """
        all_users = self._make_api_request('people').get('people')

        for user in all_users:
            name_tokens = user.get('name').split(' ')

            # Don't try to slice a name if it is only one (i.e. admin or John).
            if len(name_tokens) > 1:
                first_name, last_name = name_tokens[::len(name_tokens) - 1]
                prefix = ' '.join(name_tokens[1:-1])
            else:
                first_name = user.get('name')
                last_name = ''
                prefix = ''

            kwargs = {
                'first_name': first_name,
                'prefix': prefix,
                'last_name': last_name,
                'glassfrog_id': user.get('id'),
            }

            flindt_user, created = User.objects.update_or_create(email=user.get('email'), defaults=kwargs)
            if self.organization:
                self.organization.users.add(flindt_user)

            if created is False:
                logger.info('User:\n {}\n already exsists. User has been updated.'.format(user))
            else:
                logger.info('New user: {} has been created.'.format(flindt_user))

    def import_circles(self, anchor_circle_id):
        """
        Import the role with GlassFrog Circle id `anchor_circle_id` and all
        roles below it.

        Glassfrog makes a distinction between circles and roles. However they
        are also closely linked together in the sense that lead and rep links
        are roles that point to a circle. For example look at the Lead Link
        role for Spindle:

            {
                "id": 8353965,
                "name": "Lead Link",
                "purpose": "Building components for open communication",
                "links": {
                    "domains": [],
                    "accountabilities": [],
                    "circle": 14335,
                    "supporting_circle": null,
                    "people": []
                }
            }

        And compare that to the circle Spindle:
            {
                "id": 14335,
                "name": "Devhouse Spindle",
                "short_name": "Spindle",
                "strategy": null,
                "links": {
                    "roles": [
                        12345,
                        67890,
                        ...
                    ],
                    "policies":
                    "domain": [],
                    "supported_role": 8353936
                }
            }

        The role Lead Link has a 'link' to the "circle" 'Devhouse Spindle' and
        the circle Devhouse Spindle has a 'link' to the "supported_role" Lead
        Link.

        Only circles allow querying for underlying roles, but they don't allow
        querying for underlying circles explicitly. This means that we have to
        query the circle endpoint for underlying roles and than query the circle
        endpoint again if the role has a linked "circle".
        """
        self.import_circle(anchor_circle_id, parent_role=None)

    def import_circle(self, circle_id, parent_role=None):
        """
        Import the circle with id `circle_id` and all roles in it as a
        :class:`Role`.

        All roles in the circle will be created with this circle as the parent.
        If the circle has subcircles, this method will be called with the Role
        for the imported circle as parent_role.

        Args:
            circle_id (int): The id as used for the circle by GlassFrog.
            parent_role (Role): The Role that this circle falls under.

        Returns:
            Role: The role that was created for this circle.
        """
        logger.info('Importing circle with id: {} and parent: {}'.format(circle_id, parent_role))
        circle_dict = self._get_circle_by_id(circle_id)

        role = Role.objects.create(
            name=circle_dict.get('name'),
            purpose=self._get_circle_purpose_by_id(circle_id),
            parent=parent_role,
            accountabilities=self._get_circle_accountabilities_by_id(circle_id),
            domains=self._get_circle_domains_by_id(circle_id),
        )
        role_fullfiller = User.objects.get(
            glassfrog_id=self._get_circle_leadlink(circle_id).get('links').get('people')[0]
        )
        role.users.add(role_fullfiller)
        role.save()
        if parent_role:
            logger.info("Circle {} imported as role. PK: {}. Parent: {}, parent pk {}".format(
                role, role.pk, parent_role, parent_role.pk))

        self.import_run.roles.add(role)
        if self.organization:
            self.organization.roles.add(role)

        for role_id in circle_dict.get('links').get('roles'):
            self.import_role(role_id, parent_role=role)

    def import_role(self, role_id, parent_role):
        """
        Import the role with id `role_id` and link it to the parent
        `parent_role`.

        Args:
            role_id (int): The id used for the role by GlassFrog.
            parent_role (Role): The parent for the newly created role.
        """
        logger.info('Importing role with id: {} and parent: {}'.format(role_id, parent_role))

        role_dict = self._get_role_by_id(role_id)

        # If the role has a 'supporting_circle' it represents a circle.
        if role_dict.get('links').get('supporting_circle'):
            logger.info('Importing role with id {} as subcircle circle of {}.'.format(role_id, parent_role))
            self.import_circle(role_dict.get('links').get('supporting_circle'), parent_role=parent_role)
        else:
            role = Role.objects.create(
                name=role_dict.get('name'),
                purpose=role_dict.get('purpose') or "",
                parent=parent_role,
                accountabilities=self._get_role_accountabilities_by_id(role_id),
                domains=self._get_role_domains_by_id(role_id),
            )
            role_fullfillers = User.objects.filter(glassfrog_id__in=role_dict.get('links').get('people'))
            for user in role_fullfillers:
                role.users.add(user)
            role.save()
            self.import_run.roles.add(role)
            if self.organization:
                self.organization.roles.add(role)

            logger.info("Role {} imported as role.".format(role))

    def _make_api_request(self, uri):
        """
        Make a request to the GlassFrog API at `uri`.

        Returns:
            dict: A dictionary containing all data that was returned.
        """
        headers = {'X-Auth-Token': self.api_key}
        url = self.API_BASE_URL + uri
        r = requests.get(url, headers=headers)
        return r.json()

    @property
    def _circles(self):
        """
        Return all the information at /circles?include=members.

        Cached, so we have to wait for the API only once.

        Returns:
            dict: The response at /circles?include=members as a dict.
        """
        if self._circles_cached:
            return self._circles_cached
        else:
            self._circles_cached = self._make_api_request('circles?include=members')
            return self._circles_cached

    def _get_circle_by_id(self, id):
        """
        Return the circle with id `id`.

        The API returns an array of circles that is converted to a list in
        Python. This utility finds the circle in that list.

        Returns:
            dict: A dictionary containing information about a circle.
        """
        circles_list = self._circles.get('circles')
        match = next((c for c in circles_list if c['id'] == id), None)
        return match

    @property
    def _roles(self):
        """
        Return all the information at /roles/.

        Cached, so we have to wait for the API only once.

        Returns:
            dict: The response at /roles/ as a dict.
        """
        if self._roles_cached:
            return self._roles_cached
        else:
            self._roles_cached = self._make_api_request('roles/')
            return self._roles_cached

    def _get_role_by_id(self, id):
        """
        Return the role with id `id`.

        The API returns an array of roles that is converted to a list in
        Python. This utility finds the role in that list.

        Returns:
            dict: A dictionary containing information about a role.
        """
        roles_list = self._roles.get('roles')
        match = next((c for c in roles_list if c['id'] == id), None)
        return match

    def _get_circle_leadlink(self, id):
        """
        Return the lead link role for the circle with id `id`.

        Args:
            int: Circle id.

        Returns:
            dict: The lead link for the circle.
        """
        lead_link_id = self._get_circle_by_id(id).get('links').get('supported_role')
        lead_link_role = self._get_role_by_id(lead_link_id)
        return lead_link_role

    def _get_circle_purpose_by_id(self, id):
        """
        Return the purpose for circle with id `id`.

        The API does not return the purpose for a circle. The circle must be
        retrieved from the lead link for the circle.

        Args:
            id (int): The id for the circle.

        Returns:
            str: The purpose for the circle.
        """
        purpose = self._get_circle_leadlink(id).get('purpose')
        # Make sure a string is returned, instead of None.
        if not purpose:
            return ''
        return purpose

    def _get_circle_accountabilities_by_id(self, id):
        """
        Return the accountabilities of the circle with id `id`.

        The API does not return the accountabilities for a circle. They
        must retrieved from the lead link for the circle.

        Args:
            id (int): The id for the circle.

        Returns:
            str: The accountabilities formatted as a JSON array.
        """
        accountability_ids = self._get_circle_leadlink(id).get('links').get('accountabilities')
        if not accountability_ids:
            return ''
        accountabilities = []
        for accountability_id in accountability_ids:
            accountabilities.append(self._get_accountability_by_id(accountability_id))
        return json.dumps(accountabilities)

    def _get_circle_domains_by_id(self, id):
        """
        Return the domains of the circle with id `id`.

        The API does not return the domains for a circle. They
        must retrieved from the lead link for the circle.

        Returns:
            str: The domains formatted as a JSON array.
        """
        domain_ids = self._get_circle_leadlink(id).get('links').get('domains')
        if not domain_ids:
            return ''
        domains = []
        for domain_id in domain_ids:
            domains.append(self._get_domain_by_id(domain_id))
        return json.dumps(domains)

    def _get_role_accountabilities_by_id(self, id):
        """
        Return the accountabilities of the role with id `id`.

        Args:
            id (int): The id for the role.

        Returns:
            str: The accountabilities formatted as a JSON array.
        """
        accountability_ids = self._get_role_by_id(id).get('links').get('accountabilities')
        if not accountability_ids:
            return ''
        accountabilities = []
        for accountability_id in accountability_ids:
            accountabilities.append(self._get_accountability_by_id(accountability_id))
        return json.dumps(accountabilities)

    def _get_role_domains_by_id(self, id):
        """
        Return the domains of the role with id `id`.

        Args:
            id (int): The id for the role.

        Returns:
            str: The domains formatted as a JSON array.
        """
        domain_ids = self._get_role_by_id(id).get('links').get('domains/')
        if not domain_ids:
            return ''
        domains = []
        for domain_id in domain_ids:
            domains.append(self._get_domain_by_id(domain_id))
        return json.dumps(domains)

    def _get_accountability_by_id(self, id):
        """
        Return the accountability with id `id`.

        Returns:
            str: The accountability.
        """
        accountabilities_list = self._roles.get('linked').get('accountabilities')
        match = next((a for a in accountabilities_list if a['id'] == id), None)
        return match.get('description')

    def _get_domain_by_id(self, id):
        """
        Return the domain with id `id`.

        Returns:
            str: The domain.
        """
        domains_list = self._roles.get('linked').get('domains')
        match = next((a for a in domains_list if a['id'] == id), None)

        return match.get('description')
