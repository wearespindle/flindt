from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns

from flindt.feedback.views import FeedbackAsk, FeedbackAskCircles, FeedbackAskRoles, FeedbackAskPerson

urlpatterns = [
    path('ask/circles/', FeedbackAskCircles.as_view(), name='feedback-ask-circles'),
    path('ask/roles/', FeedbackAskRoles.as_view(), name='feedback-ask-roles'),
    re_path(
        r'^ask/roles/(?P<circle_id>[0-9]+)/', FeedbackAskRoles.as_view(), name='feedback-ask-roles-with-circle-id'
    ),
    path('ask/person/', FeedbackAskPerson.as_view(), name='feedback-ask-person'),
    re_path(
        r'^ask/person/(?P<circle_id>[0-9]+)/', FeedbackAskPerson.as_view(), name='feedback-ask-person-with-circle-id'
    ),
    path('ask/', FeedbackAsk.as_view(), name='feedback-ask'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
