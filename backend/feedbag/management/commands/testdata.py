from django.core.management import BaseCommand

from feedbag.feedback.tests.factories import FeedbackFactory


class Command(BaseCommand):
    help = """Populate the database with test data."""

    def handle(self, *args, **options):
        batch_size = 20

        FeedbackFactory.create_batch(batch_size)
