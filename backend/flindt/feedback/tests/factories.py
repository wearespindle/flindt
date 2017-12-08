import datetime
import factory
import pytz

from django.utils import timezone

from factory.declarations import LazyAttribute, SubFactory
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyInteger, FuzzyChoice, FuzzyDateTime
from faker import Factory

from flindt.feedback.models import Feedback, FeedbackOnIndividual, FeedbackOnRole, Question, Rating, Remark
from flindt.role.tests.factories import RoleFactory
from flindt.user.models import User

faker = Factory.create('nl_NL')
past_date = timezone.now() - datetime.timedelta(days=10)
future_date = timezone.now() + datetime.timedelta(days=10)


class QuestionFactory(DjangoModelFactory):
    name = LazyAttribute(lambda o: faker.word())
    content = LazyAttribute(lambda o: faker.text())

    class Meta:
        model = Question


class RatingFactory(DjangoModelFactory):
    name = LazyAttribute(lambda o: faker.word())
    description = LazyAttribute(lambda o: faker.text())

    class Meta:
        model = Rating


class RemarkFactory(DjangoModelFactory):
    rating = SubFactory(RatingFactory)
    content = LazyAttribute(lambda o: faker.text())

    class Meta:
        model = Remark


class FeedbackOnIndividualFactory(DjangoModelFactory):
    question = SubFactory(QuestionFactory)
    answer = LazyAttribute(lambda o: faker.text())

    class Meta:
        model = FeedbackOnIndividual


class FeedbackOnRoleFactory(DjangoModelFactory):
    role = SubFactory(RoleFactory)
    remarks = SubFactory(RemarkFactory)

    class Meta:
        model = FeedbackOnRole


class FeedbackFactory(DjangoModelFactory):
    date = FuzzyDateTime(past_date, future_date)
    recipient = factory.Iterator(User.objects.all())
    sender = factory.Iterator(User.objects.all())
    status = FuzzyChoice(dict(Feedback.STATUS_CHOICES).keys())
    how_recognizable = FuzzyInteger(0, 10)
    how_valuable = FuzzyInteger(0, 10)
    actionable = FuzzyChoice([True, False])
    individual = SubFactory(FeedbackOnIndividualFactory)

    class Meta:
        model = Feedback
