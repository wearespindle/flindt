from django.db import models
from django.utils.translation import ugettext as _
from feedbag.base.models import FeedBagBaseModel
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

    def __str__(self):
        return self.name
