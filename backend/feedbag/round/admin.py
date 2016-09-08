from django.contrib import admin
from django.utils.translation import ugettext as _

from django_object_actions import DjangoObjectActions
from feedbag.integrations.importer import GlassFrogImporter

from .models import Round
from .manager import RoundManager


class RoundAdmin(DjangoObjectActions, admin.ModelAdmin):
    def start_round(self, request, obj):
        round_manager = RoundManager(obj)
        round_manager.start_round()

    start_round.label = _('Start the round.')
    start_round.short_description = "This will create feedback objects."

    change_actions = ('start_round',)


admin.site.register(Round, RoundAdmin)
