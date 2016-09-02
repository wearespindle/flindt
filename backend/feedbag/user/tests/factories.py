from django.contrib.auth.hashers import make_password

from factory.declarations import LazyAttribute
from factory.django import DjangoModelFactory
from faker.factory import Factory

from feedbag.user.models import User

faker = Factory.create('nl_NL')


class UserFactory(DjangoModelFactory):
    first_name = LazyAttribute(lambda o: faker.first_name())
    last_name = LazyAttribute(lambda o: faker.last_name())
    email_address = LazyAttribute(lambda o: faker.email())
    password = make_password('password')

    class Meta:
        model = User
