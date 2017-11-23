from django.contrib import admin
from django.utils.translation import ugettext as _

from .models import Role


class IsCircleListFilter(admin.SimpleListFilter):
    # Human-readable title which will be displayed in the
    # right admin sidebar just above the filter options.
    title = _('Is Circle')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'is_circle'

    def lookups(self, request, model_admin):
        """
        Returns a list of tuples.

        The first element in each tuple is the coded value
        for the option that will appear in the URL query.
        The second element is the human-readable name for the
        option that will appear in the right sidebar.
        """
        return (('is_circle', _('Is circle')), ('is_not_circle', _('Is not circle')),)

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        if self.value() == 'is_circle':
            return queryset.filter(children__isnull=False)
        elif self.value() == 'is_not_circle':
            return queryset.filter(children__isnull=True)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_circle', 'parent', 'purpose', 'archived',)
    list_filter = ('archived', IsCircleListFilter)
    search_fields = ('name',)
    actions = ['archive_role']

    def archive_role(self, request, queryset):
        for role in queryset:
            role.archive()
        self.message_user(request, 'Roles were successfully archived.')

    archive_role.short_description = 'Archive selected roles'
