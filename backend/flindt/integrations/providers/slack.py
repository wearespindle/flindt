import logging

from slacker import Slacker, Error

from flindt import settings
from flindt.integrations.providers.provider import Provider

logger = logging.getLogger(__name__)


class SlackProvider(Provider):
    """
    Provider for sending slack messages.
    """

    def __init__(self, *args, **kwargs):
        """
        Args:
            user (User): The user that should receive the message.

        TODO: FEED-59: Replace slack integration with app instead of bot.
        """
        self.user = kwargs['user']
        self.slacker = Slacker(self.user.organization_set.first().slack_bot_api_key)

    def send_message(self, message):
        try:
            if not settings.SILENT_RUN:
                self.slacker.chat.post_message(self.user.slack_user_name, message, as_user='@flindt')
            logger.info('Slack send to {} ({}).'.format(self.user.email, self.user.slack_user_name))
        except Error as e:
            from flindt.round.manager import IntegrationError
            raise IntegrationError('Slack error "{}" for user "{}"'.format(e, self.user))
