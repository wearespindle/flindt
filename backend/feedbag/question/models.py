from django.db import models
from django.utils.translation import ugettext as _

from feedbag.base.models import FeedBagBaseModel


class Question(FeedBagBaseModel):
    """
    Model for the questions people can answer as an addition to the general
    feedback given.
    """
    name = models.CharField(
        _('name'),
        max_length=255,)
    content = models.TextField(
        _('content'),
    )
