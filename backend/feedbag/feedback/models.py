
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _

from feedbag.base.models import FeedBagBaseModel
from feedbag.role.models import Role
from feedbag.round.models import Round
from feedbag.user.models import User


class Rating(FeedBagBaseModel):
    """
    A Rating is used to to add a ‘feeling’ to a Remark. Like Sad, happy, could
    be better or "I have no idea what to say about this". It can be accompanied
    by an image, which is normally a emoji to confer the feeling.
    """
    name = models.CharField(max_length=255,)
    # TODO: FEED-29: Add pillow, so that we can use ImageFields
    # image = models.ImageField(
    #     _('image'),
    #     blank=True,
    # )
    description = models.TextField(blank=True,)

    def __str__(self):
        return self.name


class Remark(FeedBagBaseModel):
    """
    A Feedback is not complete without one or more Remarks.

    A Feedback can link to a rating to confer an emotion.
    """
    rating = models.ForeignKey(
        Rating,
        related_name='rating',
        null=True
    )
    content = models.TextField(_('content'))

    def __str__(self):
        return '{}: {}'.format(self.rating, self.content)


class Question(FeedBagBaseModel):
    """
    Model for the questions people can answer as an addition to the general
    feedback given.
    """
    name = models.CharField(
        _('name'),
        max_length=255,
    )
    content = models.TextField(blank=True,)

    def __str__(self):
        return self.name


class FeedbackOnIndividual(FeedBagBaseModel):
    question = models.ForeignKey(
        Question,
        related_name='question',
    )
    answer = models.TextField(blank=True,)

    def __str__(self):
        return str(self.question)


class FeedbackOnRole(FeedBagBaseModel):
    """
    Model for the feedback on roles.
    """
    role = models.ForeignKey(Role, blank=True, null=True)
    remarks = models.ManyToManyField(
        Remark,
        blank=True,
    )

    def __str__(self):
        return 'Feedback on {}'.format(self.role)


class Feedback(FeedBagBaseModel):
    """
    Base feedback model which contains fields used for both feedback models.
    """
    INCOMPLETE, COMPLETE = range(2)

    STATUS_CHOICES = ((INCOMPLETE, _('Incomplete')),
                      (COMPLETE, _('Complete')),)

    date = models.DateTimeField()
    recipient = models.ForeignKey(
        User,
        related_name='%(class)s_received_feedback',
    )
    sender = models.ForeignKey(
        User,
        related_name='%(class)s_sent_feedback',
    )
    status = models.IntegerField(
        default=INCOMPLETE,
        choices=STATUS_CHOICES,
    )
    how_recognizable = models.IntegerField(
        blank=True, null=True, validators=[
            MinValueValidator(0),
            MaxValueValidator(10),
        ]
    )
    how_valuable = models.IntegerField(
        blank=True, null=True, validators=[
            MinValueValidator(0),
            MaxValueValidator(10),
        ]
    )
    actionable = models.BooleanField()
    actionable_content = models.TextField(blank=True)
    individual = models.ForeignKey(FeedbackOnIndividual, null=True, blank=True)
    role = models.ForeignKey(FeedbackOnRole, null=True, blank=True)
    round = models.ForeignKey(Round, null=True, blank=True)

    def __str__(self):
        if self.role:
            return 'Feedback from {} on role: {} for {}'.format(self.sender, self.role, self.recipient)
        if self.individual:
            return 'Feedback from {} on individual: {}'.format(self.sender, self.recipient)



    # TODO: FEED-71: We should discern between date_created and date_completed.
    # If we make changing the status from incomplete to complete an action, the
    # overwriting of __init__ can be skipped.
    __original_status = None

    def save(self):
        """
        If the status changes, the date should be updated.
        """
        if self.__original_status != self.status:
            self.date = timezone.now()
        super(Feedback, self).save()

    def __init__(self, *args, **kwargs):
        """
        When the status changes between 'incomplete' to 'complete', `date` should
        be updated. To check this, we save the value of `status` when the
        object is initialized.
        """
        super(Feedback, self).__init__(*args, **kwargs)
        self.__original_status = self.status
    # END_TODO: FEED-71
