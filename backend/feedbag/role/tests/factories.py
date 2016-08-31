<<<<<<< 131e9df3da671c21b792775a46c17f840c7bb9b8
=======
# from factory import factories
>>>>>>> FEED-17: Add the Role model
import factory

from .. import models


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Role
