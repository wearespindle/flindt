from logging import WARNING

from django.contrib import admin
from django.utils.translation import ugettext as _

from django_object_actions import DjangoObjectActions

from .manager import IntegrationError, NoSolutionPossible, RoundManager, UserInformationNotComplete
from .models import Round


class RoundAdmin(DjangoObjectActions, admin.ModelAdmin):
    change_actions = ('start_round',)

    def start_round(self, request, obj):
        round_manager = RoundManager(obj)
        try:
            round_manager.start_round()
            obj.message_for_open()
        except UserInformationNotComplete as ue:
            self.message_user(request, 'The round is NOT started.', level=WARNING)
            if ue.data:
                if ue.data['without_role']:
                    self.message_user(
                        request,
                        'Users found without any roles: {}'.format(', '.join(ue.data['without_role']))
                    )
                if ue.data['without_slack_id']:
                    self.message_user(
                        request,
                        'Users found without slack id: {}'.format(', '.join(ue.data['without_slack_id']))
                    )
        except NoSolutionPossible:
            self.message_user(request,
                              'Not possible to start a round when users are included that do not fulfill any role!')
        except IntegrationError as e:
            self.message_user(request, 'There was an integration error: {}'.format(e))
        else:
            self.message_user(request, 'Round started!')

    start_round.label = _('Start the round')
    start_round.short_description = 'This will create feedback objects.'

admin.site.register(Round, RoundAdmin)
