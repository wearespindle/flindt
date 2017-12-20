import logging

from django.db import models

from flindt.base.models import FlindtBaseModel
from flindt.user.models import User

logger = logging.getLogger(__name__)


class Role(FlindtBaseModel):
    """
    The Role model is used to store information about roles.

    It is primarily designed to capture information about roles
    in the holacratic sense of the word, but can also be used to
    reflect a more traditional organisation.
    """
    name = models.TextField()
    purpose = models.TextField(blank=True, default='')
    accountabilities = models.TextField(blank=True, default='')  # Used to store JSON
    domains = models.TextField(blank=True, default='')  # Used to store JSON
    parent = models.ForeignKey('Role', related_name='children', blank=True, null=True)
    users = models.ManyToManyField(User, blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    @property
    def is_circle(self):
        """
        True if the circle has children.
        """
        return self.children.exists() is True

    @property
    def is_anchor(self):
        """
        True if the circle has no parents.
        """
        return self.parent is None

    def descendants(self):
        """
        Return all descendants of `self` in a list.

        TODO: FEED-50: descendants should be a method on a manager returning a
        queryset.
        """
        descendants = []
        children = self.children.all()
        descendants.extend(children)
        for child in children:
            descendants.extend(child.descendants())
        return descendants

    def archive(self):
        """
        Archive this role and all roles under it.

        TODO: FEED-50: If descendants is a queryset, replace this with one
        update()
        """
        self.archived = True
        self.save()
        for role in self.descendants():
            role.archived = True
            role.save()
        logger.info('role: {} and all its descendants have been archived.'.format(self))


class Focus(FlindtBaseModel):
    """
    Used to store a focus for a specific user on a role.

    TODO: FEED-47: Start using/importing focuses. It seems that the GlassFrog
    API, does not currently know about focus.
    """
    role = models.ForeignKey('Role')
    user = models.ForeignKey(User)
    name = models.TextField()

    def __str__(self):
        return "Focus {} for user {}".format(self.name, self.user)
