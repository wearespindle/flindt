from django.db import models

from feedbag.base.models import FeedBagBaseModel
from feedbag.user.models import User


class Role(FeedBagBaseModel):
    """
    The Role model is used to store information about roles. It is primarily
    designed to capture informtion about roles in the holacratic sense of the
    world, but can also be used to reflect a more traditional organisation.
    """
    name = models.TextField()
    purpose = models.TextField()
    # TODO: FEED-41: Use a JSON field to validate contents.
    accountabilities = models.TextField(blank=True)  # Used to store JSON
    domains = models.TextField(blank=True)  # Used to store JSON
    parent = models.ForeignKey('Role', related_name='children', blank=True, null=True)
    # Rep and Lead Link are special because the can receive/give feedback in two circles.
    rep_link = models.ForeignKey('Role', blank=True, null=True, related_name='+')
    lead_link = models.ForeignKey('Role', blank=True, null=True, related_name='+')

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


class Focus(FeedBagBaseModel):
    """
    Used to store a focus for a specific user on a role.
    """
    role = models.ForeignKey('Role')
    user = models.ForeignKey(User)
    name = models.TextField()

    def __str__(self):
        return "Focus {} for user {}".format(self.name, self.user)
