from django.core.management.base import BaseCommand

from flindt.role.models import Role

from ...importer import GlassFrogImporter


class Command(BaseCommand):
    """
    import can currently be used to import users and roles from GlassFrog.

    To import roles, a circle id should always be provided.
    """
    help = 'Import users and roles from GlassFrog.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--api-key',
            type=str,
            dest='api_key',
            default=False,
            help='The API key to use for GlassFrog',
        )
        parser.add_argument(
            '--users',
            action='store_true',
            dest='users',
            default=False,
            help='Import Glassfrog users.',
        )
        parser.add_argument(
            '--roles',
            action='store',
            dest='roles',
            type=int,
            help='Import Glassfrog roles with <circle_id> and all its descendants.',
        )
        parser.add_argument(
            '--archive',
            action='store',
            dest='archive',
            type=int,
            help='Archive role with id <id> and all its descendants.',
        )

    def handle(self, *args, **options):
        self.api_key = options['api_key']

        if options['users']:
            self.import_users()
        if options['roles']:
            self.import_roles(options['roles'])
        if options['archive']:
            self.archive_roles(options['archive'])

    def import_users(self):
        g = GlassFrogImporter(api_key=self.api_key)
        g.import_users()

    def import_roles(self, circle_id=None):
        g = GlassFrogImporter(api_key=self.api_key)
        g.import_circles(circle_id)

    def archive_roles(self, role_id):
        """
        Before running a new import, it is advisable to archive all older roles
        for the circle you want to import.
        """
        role = Role.objects.get(id=role_id)
        role.archive()
