from django.core.management import BaseCommand

from feedbag.feedback.tests.factories import FeedbackFactory
from feedbag.role.tests.factories import RoleFactory
from feedbag.user.tests.factories import UserFactory


class Command(BaseCommand):
    help = """Populate the database with test data."""

    def handle(self, *args, **options):
        batch_size = 20

        UserFactory.create_batch(batch_size)
        RoleFactory.create_batch(5)

        FeedbackFactory.create_batch(batch_size)
