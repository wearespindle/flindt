from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from flindt.feedback.views import FeedbackAsk, FeedbackAskCircles, FeedbackAskRoles, FeedbackAskPerson

urlpatterns = [
    url(r'^ask/circles/$', FeedbackAskCircles.as_view(), name='feedback-ask-circles'),
    url(r'^ask/roles/(?P<circle_id>[0-9]+)/$', FeedbackAskRoles.as_view(), name='feedback-ask-roles'),
    url(r'^ask/person/(?P<circle_id>[0-9]+)/$', FeedbackAskPerson.as_view(), name='feedback-ask-person'),
    url(r'^ask/$', FeedbackAsk.as_view(), name='feedback-ask')
]

urlpatterns = format_suffix_patterns(urlpatterns)
