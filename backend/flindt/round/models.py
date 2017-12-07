from django.conf import settings
from django.db import models
from django.utils.translation import ugettext as _

from flindt.base.models import FlindtBaseModel
from flindt.integrations.messenger import Messenger
from flindt.user.models import User


class Round(FlindtBaseModel):
    """
    Contains information about a round.
    A round contains the setting for a round of feedback.
    """
    participants_senders = models.ManyToManyField(
        User,
        related_name='+',
    )
    participants_receivers = models.ManyToManyField(
        User,
        related_name='+',
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(help_text='Editing of feedback will be disabled after this date has passed.')
    description = models.CharField(
        _('description'),
        max_length=255,
    )
    # determines the amount of roles each user has to review
    roles_to_review = models.PositiveSmallIntegerField()
    # determines the amount of people each user has to review
    individuals_to_review = models.PositiveSmallIntegerField()
    # How many people need to be given feedback before being able to view the “report”.
    min_feedback_sent = models.PositiveIntegerField()
    question_for_individual_feedback = models.ForeignKey('feedback.Question', blank=True, null=True)
    available_ratings = models.ManyToManyField('feedback.Rating')

    def __str__(self):
        return 'Description: {}, Receivers: #{}, senders: {}, roles: {}, indiv: {}'.format(
            self.description, self.participants_receivers.count(), self.participants_senders.count(),
            self.roles_to_review, self.individuals_to_review
        )

    def message_for_open(self):
        """
        Send a message that a new round has started.

        The message will only be send to participants of the round that
        actually have to give feedback.
        Participants of the round that only receive feedback, will not
        receive a message that the round has started.
        """
        # Prevent circular import.
        from flindt.feedback.models import Feedback

        message = _(
            'Hey, a new feedback round started. Start helping colleagues by giving them some feedback at {}.'.
            format(settings.FRONTEND_HOSTNAME)
        )

        sending_user_pks = Feedback.objects.filter(round=self.pk).values_list('sender__pk', flat=True).distinct()
        for sender in sending_user_pks:
            messenger = Messenger(user=sender)
            messenger.send_message(message)

    def message_for_close(self):
        """
        Send a message to all feedback recipients that the round has closed.
        """
        message = _(
            'The feedback round is over. Check (and rate) your feedback at {}'.
            format(settings.FRONTEND_HOSTNAME)
        )

        for user in self.participants_receivers.all():
            messenger = Messenger(user=user)
            messenger.send_message(message)
