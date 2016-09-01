import logging

import requests

from feedbag.user.models import User

logger = logging.getLogger(__name__)


class Importer(object):
    """
    Importer is an abstract class. Subclasses can implement several methods
    that can be used by the `import` command.
    """

    def import_users(self):
        """
        Import users.
        """
        raise NotImplementedError

    def import_roles(self):
        """
        Import roles.
        """
        raise NotImplementedError

    class Meta:
        abstract = True


class GlassFrogImporter(Importer):
    """
    GlassFrogImporter can be used to import users and roles from GlassFrog.
    """
    API_BASE_URL = 'https://glassfrog.holacracy.org/api/v3/'

    def __init__(self, *args, **kwargs):
        self.api_key = kwargs.get('api_key')

    def make_api_request(self, uri):
        """
        Make a request to the GlassFrog API at `uri`.

        Returns:
            dict: A dictionary containing all data that was returned.
        """
        headers = {'X-Auth-Token': self.api_key}
        url = self.API_BASE_URL + uri
        r = requests.get(url, headers=headers)
        return r.json()

    def import_roles(self, id):
        """
        Create the role and link it to all users that fullfill the role.
        """
        pass

    def import_users(self):
        """
        Create a user for every user found in GlassFrog. If a user with the
        same information is already in the DB, don't create it again.

        Example JSON Response:

        {'people': [{'email': 'joris.engbers@wearespindle.com',
            'external_id': None,
            'id': 17466,
            'links': {'circles': [9550, 7210, 3943, 15171, 5338, 14335, 8650]},
            'name': 'Joris Engbers'},
            ...
            ...
            ...
        ]}
        """
        all_users = self.make_api_request('people').get('people')

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

            feedbag_user, created = User.objects.update_or_create(email_address=user.get('email'), defaults=kwargs)

            if created is False:
                logger.info('User:\n {}\n already exsists. User has been updated.'.format(user))
            else:
                logger.info('New user: {} has been created.'.format(feedbag_user))
