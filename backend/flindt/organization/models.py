import logging

import datetime
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _

from flindt.base.models import FlindtBaseModel
from flindt.feedback.models import Feedback
from flindt.integrations.messenger import Messenger
from flindt.role.models import Role
from flindt.user.models import User

logger = logging.getLogger(__name__)


class Organization(FlindtBaseModel):
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

    def message_for_reminder(self):
        """
        Send a message to all users that have unfinished feedbacks that is
        older than 7 days.
        """
        now = timezone.now()
        week_ago = now - datetime.timedelta(days=7)

        message = _(
            _("Hey, we noticed that people are waiting for your feedback, please help your colleagues by giving them "
              "some feedback at {}/give-feedback.").
            format(settings.FRONTEND_HOSTNAME)
        )
        for user in self.users.all():
            if user.feedback_sent_feedback.filter(status=Feedback.INCOMPLETE, round__start_date__lt=week_ago).exists():
                messenger = Messenger(user=user)
                messenger.send_message(message)
