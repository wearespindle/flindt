from django.contrib import admin

from .models import Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',
                    'is_circle',
                    'parent',
                    'purpose',
                    'archived',
                    )
    list_filter = ('archived',)
    actions = ['archive_role']

    def archive_role(self, request, queryset):
        for role in queryset:
            role.archive()
        self.message_user(request, "Roles were successfully archived.")
    archive_role.short_description = 'Archive selected roles'
