from django.core.management import BaseCommand

from ...manager import RoundManager
from ...models import Round


class Command(BaseCommand):
    help = """
    Helper command to start a feedback round, it will pick the first round in the DB.
    """

    def handle(self, *args, **options):
        round = Round.objects.first()
        manager = RoundManager(round)
        manager.start_round()
        print('')
        print('success, tries: {}'.format(manager.tries))
