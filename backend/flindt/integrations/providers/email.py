import logging
import smtplib

from django.core.mail import send_mail

from flindt import settings
from flindt.integrations.providers.provider import Provider

logger = logging.getLogger(__name__)


class EmailProvider(Provider):
    """
    Provider for sending email messages.
    """

    def __init__(self, *args, **kwargs):
        """
        Args:
            user (User): The user that should receive the message.
        """
        self.user = kwargs['user']

    def send_message(self, message):
        try:
            if not settings.SILENT_RUN:
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
            raise IntegrationError('Email error "{}" for user "{}"'.format(e, self.user))
