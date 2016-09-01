from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from ...importer import GlassFrogImporter


class Command(BaseCommand):
    """

    """
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            action='store_true',
            dest='users',
            default=False,
            help='Import Glassfrog users.',
        )

    def handle(self, *args, **options):
        print(options)
        if options['users']:
            self.import_users()

    def import_users(self):
        api_key = settings.GLASSFROG_API_KEY
        if not api_key:
            raise CommandError('GLASSFROG_API_KEY not found in settings!')

        g = GlassFrogImporter(api_key=settings.GLASSFROG_API_KEY)
        g.import_users()
