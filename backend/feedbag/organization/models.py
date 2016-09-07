import logging

from django.db import models

from feedbag.base.models import FeedBagBaseModel
from feedbag.role.models import Role
from feedbag.user.models import User

logger = logging.getLogger(__name__)


class Organization(FeedBagBaseModel):
    """
    An organization is used to couple roles and users to a specific
    organization. This is useful to archive all roles for an organization. An
    organization can also have API_KEYS for different integrations.
    """
    name = models.CharField(unique=True, max_length=255)
    glassfrog_api_key = models.CharField(max_length=255, blank=True)
    slack_bot_api_key = models.CharField(max_length=255, blank=True)
    glassfrog_anchor_circle_id = models.IntegerField(blank=True, null=True)
    users = models.ManyToManyField(User, blank=True)
    roles = models.ManyToManyField(Role, blank=True)

    def __str__(self):
        return self.name
