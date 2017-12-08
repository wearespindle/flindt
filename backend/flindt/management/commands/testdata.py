from django.conf import settings
from django.core.management import BaseCommand

from flindt.feedback.tests.factories import FeedbackFactory
from flindt.role.tests.factories import RoleFactory
from flindt.user.tests.factories import UserFactory


class Command(BaseCommand):
    help = """Populate the database with test data."""

    def handle(self, *args, **options):
        """
        Handler for the testdata command.

        Sets DEBUG=True to prevent messages from being (attempted to)
        send in the save() of the Feedback Model
        """
        settings.DEBUG = True
        batch_size = 20

        UserFactory.create_batch(batch_size)
        RoleFactory.create_batch(5)

        FeedbackFactory.create_batch(batch_size)
        settings.DEBUG = False
