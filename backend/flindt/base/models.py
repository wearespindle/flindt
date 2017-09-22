from django.db import models


class FlindtBaseModel(models.Model):
    """
    All models in Flindt subclass from FlindtBaseModel.

    This gives us an easy entrypoint to add universal features
    (i.e. multi-tenancy) later.
    """

    class Meta:
        abstract = True
