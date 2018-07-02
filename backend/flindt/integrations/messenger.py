import logging

from django.conf import settings

from flindt.integrations.providers.email import EmailProvider
from flindt.integrations.providers.slack import SlackProvider

logger = logging.getLogger(__name__)


class Messenger(object):
    """
    Messenger is used to send messages to a user, using the users preferred way
    of being contacted. Currently email and slack have been implemented.
    """

    def __init__(self, *args, **kwargs):
        self.user = kwargs['user']

        if self.user.slack_user_name and self.user.organization_set.first().slack_bot_api_key:
            self.provider = SlackProvider(user=self.user)
        else:
            self.provider = EmailProvider(user=self.user)

    def send_message(self, message):
        # When in DEBUG mode also log the message to the console.
        if settings.DEBUG:
            logger.info(message)
        self.provider.send_message(message)
