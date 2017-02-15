from django.contrib import admin
from django.utils.translation import ugettext as _

from django_object_actions import DjangoObjectActions
from feedbag.integrations.importer import GlassFrogImporter

from .models import Organization


class OrganizationAdmin(DjangoObjectActions, admin.ModelAdmin):
    def import_users(self, request, obj):
        g = GlassFrogImporter(api_key=obj.glassfrog_api_key, organization=obj)
        g.import_users()
    import_users.label = _('Import users for this organization')

    def import_roles(self, request, obj):
        g = GlassFrogImporter(api_key=obj.glassfrog_api_key, organization=obj)
        g.import_circles(anchor_circle_id=obj.glassfrog_anchor_circle_id)
    import_roles.label = _('Import roles for this organization')

    def archive_roles(self, request, obj):
        obj.roles.update(archived=True)
    archive_roles.label = _('Archive existing roles for this organization')

    def send_reminder(self, request, obj):
        obj.message_for_reminder()

    send_reminder.label = _('Send reminder')
    send_reminder.short_description = _('Send a reminder to users that have unfinished feedback older than a week.')

    change_actions = ('import_users', 'import_roles', 'archive_roles', 'send_reminder')


admin.site.register(Organization, OrganizationAdmin)
