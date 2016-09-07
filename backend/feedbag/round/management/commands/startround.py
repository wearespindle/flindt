from django.core.management import BaseCommand

from ...manager import RoundManager, NoSolutionFound
from ...models import Round


class Command(BaseCommand):
    help = """
    import can currently be used to import users and roles from GlassFrog.

    To import roles, a circle id should always be provided.
    """

    def handle(self, *args, **options):
        round = Round.objects.first()
        manager = RoundManager(round)
        try:
            manager.start_round()
        except NoSolutionFound:
            print('')
            print('fout!')
        else:
            print('')
            print('success, tries: {}'.format(manager.tries))
