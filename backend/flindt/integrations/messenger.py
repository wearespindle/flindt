import logging
import smtplib

from django.conf import settings
from django.core.mail import send_mail
from slacker import Error, Slacker

logger = logging.getLogger(__name__)


class Provider(object):
    """
    A Provider implements `send_message` which sends a message using a
    mechanism like email or Slack.
    """

    def send_message(self, message):
        """
        Send `message` to `user` using the users preferred channel.

        Args:
            message (str): A string containing the message.
        """
        raise NotImplementedError


class EmailProvider(Provider):
    def __init__(self, *args, **kwargs):
        """
        Args:
            user (User): The user that should receive the message.
        """
        self.user = kwargs['user']

    def send_message(self, message):
        try:
            send_mail(
                'New message from Flindt',
                message,
                settings.DEFAULT_FROM_EMAIL,
                [self.user.email],
                fail_silently=False,
            )
            logger.info('Email send to {}.'.format(self.user.email))
        except smtplib.SMTPServerDisconnected as e:
            from flindt.round.manager import IntegrationError
            raise IntegrationError('Email error "%s" for user "%s"' % (e, self.user))


class SlackProvider(Provider):
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
            self.slacker.chat.post_message(self.user.slack_user_name, message, as_user='@flindt')
            logger.info('Slack send to {}.'.format(self.user.slack_user_name))
        except Error as e:
            from flindt.round.manager import IntegrationError
            raise IntegrationError('Slack error "%s" for user "%s"' % (e, self.user))


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
        self.provider.send_message(message)
