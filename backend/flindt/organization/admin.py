from django.contrib import admin
from django.utils.translation import ugettext as _
from django_object_actions import DjangoObjectActions

from flindt.integrations.importer import GlassFrogImporter
from flindt.round.manager import IntegrationError

from .models import Organization


class OrganizationAdmin(DjangoObjectActions, admin.ModelAdmin):
    def import_users(self, request, obj):
        g = GlassFrogImporter(api_key=obj.glassfrog_api_key, organization=obj)
        g.import_users()
        self.message_user(request, 'Users imported.')
    import_users.label = _('Import users for this organization')

    def import_roles(self, request, obj):
        g = GlassFrogImporter(api_key=obj.glassfrog_api_key, organization=obj)
        g.import_circles(anchor_circle_id=obj.glassfrog_anchor_circle_id)
        self.message_user(request, 'Roles imported.')
    import_roles.label = _('Import roles for this organization')

    def archive_roles(self, request, obj):
        obj.roles.update(archived=True)
        self.message_user(request, 'Roles archived.')
    archive_roles.label = _('Archive existing roles for this organization')

    def send_reminder(self, request, obj):
        try:
            obj.message_for_reminder()
            self.message_user(request, 'Reminder sent.')
        except IntegrationError as e:
            self.message_user(request, 'There was an integration error: %s' % e)

    send_reminder.label = _('Send reminder')
    send_reminder.short_description = _('Send a reminder to users that have unfinished feedback older than a week.')

    change_actions = ('import_users', 'import_roles', 'archive_roles', 'send_reminder')


admin.site.register(Organization, OrganizationAdmin)
