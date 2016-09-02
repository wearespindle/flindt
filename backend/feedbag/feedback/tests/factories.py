import datetime

from factory.declarations import LazyAttribute, SubFactory, Iterator, SelfAttribute
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyInteger, FuzzyChoice, FuzzyNaiveDateTime
from faker.factory import Factory

from feedbag.feedback.models import Question, Feedback, FeedbackOnIndividual, FeedbackOnRole
from feedbag.user.tests.factories import UserFactory

faker = Factory.create('nl_NL')
past_date = datetime.datetime.today() - datetime.timedelta(days=10)
future_date = datetime.datetime.today() + datetime.timedelta(days=10)


class QuestionFactory(DjangoModelFactory):
    name = LazyAttribute(lambda o: faker.word())
    content = LazyAttribute(lambda o: faker.text())

    class Meta:
        model = Question


class FeedbackOnIndividualFactory(DjangoModelFactory):
    question = SubFactory(QuestionFactory)
    answer = LazyAttribute(lambda o: faker.text())

    class Meta:
        model = FeedbackOnIndividual


class FeedbackOnRoleFactory(DjangoModelFactory):
    pass


class FeedbackFactory(DjangoModelFactory):
    date = FuzzyNaiveDateTime(past_date, future_date)
    recipient = SubFactory(UserFactory)
    sender = SubFactory(UserFactory)
    status = FuzzyChoice(dict(Feedback.STATUS_CHOICES).keys())
    how_recognizable = FuzzyInteger(0, 10)
    how_valuable = FuzzyInteger(0, 10)
    actionable = FuzzyChoice([True, False])
    individual = SubFactory(FeedbackOnIndividualFactory)

    class Meta:
        model = Feedback
