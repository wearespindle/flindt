from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import ugettext as _

from flindt.base.models import FlindtBaseModel
from flindt.user.models import User


class Happiness(FlindtBaseModel):
    """
    Contains happiness information.
    """
    user = models.ForeignKey(User)
    date = models.DateTimeField()
    happiness = models.IntegerField(
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10),
        ]
    )
    description = models.CharField(
        _('description'),
        max_length=255,
    )
