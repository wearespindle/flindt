from django.conf import settings
from django.db import models
from django.utils.translation import ugettext as _

from feedbag.base.models import FeedBagBaseModel
from feedbag.integrations.messenger import Messenger
from feedbag.user.models import User


class Round(FeedBagBaseModel):
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
    end_date = models.DateTimeField()
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

    def __str__(self):
        return 'Description: {}, Receivers: #{}, senders: {}, roles: {}, indiv: {}'.format(
            self.description, self.participants_receivers.count(), self.participants_senders.count(),
            self.roles_to_review, self.individuals_to_review
        )

    def message_for_open(self):
        """
        TODO: FEED-20: Call this method when a new round is started.
        """
        message = _(
            'Hey, a new feedback round started. Start helping colleagues by giving them some feedback at {}.'.
            format(settings.FRONTEND_HOSTNAME)
        )
        for user in self.participants_senders.all():
            messenger = Messenger(user=user)
            messenger.send_message(message)

    def message_for_close(self):
        """
        TODO: FEED-20: Call this method when a round is closed.
        """
        message = _(
            'The feedback round is over. Check (and rate) your feedback at {}'.
            format(settings.FRONTEND_HOSTNAME)
        )

        for user in self.participants_receivers.all():
            messenger = Messenger(user=user)
            messenger.send_message(message)

    def message_for_reminder(self):
        """
        Send a message to all participants_senders that have unfisnished
        feedbacks.
        """
        # Prevent circular import.
        from feedbag.feedback.models import Feedback
        message = _(
            "Hey, we noticed that you haven't given feedback yet, please help your colleagues by giving them some feedback at {}".
            format(settings.FRONTEND_HOSTNAME)
        )
        for user in self.participants_senders.all():
            if user.feedback_sent_feedback.filter(status=Feedback.INCOMPLETE).exists():
                messenger = Messenger(user=user)
                messenger.send_message(message)
