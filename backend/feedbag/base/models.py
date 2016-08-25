from django.db import models


class FeedBagBaseModel(models.Model):
    """
    All models in FeedBag subclass from FeedBagBaseModel. This gives us an easy
    entrypoint to add universal features (i.e. multi-tenancy) later.
    """
    class Meta:
        abstract = True
