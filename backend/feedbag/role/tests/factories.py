import factory

from .. import models


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Role
