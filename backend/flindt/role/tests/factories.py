import factory
import random

from factory.declarations import LazyAttribute
from faker import Factory

from flindt.role.models import Role
from flindt.user.models import User

faker = Factory.create('nl_NL')


class RoleFactory(factory.django.DjangoModelFactory):
    name = LazyAttribute(lambda o: faker.word())
    purpose = LazyAttribute(lambda o: faker.bs())

    @factory.post_generation
    def users(self, create, extracted, **kwargs):
        if create:
            # Get all users, convert to list, shuffle and get between 1 and
            # 6 users.
            users = list(User.objects.all())
            random.shuffle(users)
            self.users.add(*users[:random.randint(1, 6)])

    class Meta:
        model = Role
