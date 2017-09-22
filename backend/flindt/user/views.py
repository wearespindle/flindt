from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response

from flindt.feedback.models import Feedback
from flindt.feedback.serializers import FeedbackSerializer

from .models import ExtraUserInfo, ExtraUserInfoCategory, User
from .serializers import ExtraUserInfoCategorySerializer, ExtraUserInfoSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (OrderingFilter,)

    ordering_fields = ('id', 'date', 'status')

    @list_route(methods=['GET'], url_path='feedback-as-sender')
    def feedback_as_sender(self, request, *args, **kwargs):
        """
        This view returns all the feedback the user has sent.
        """
        sent_feedback = Feedback.objects.filter(sender=self.request.user)
        page = self.paginate_queryset(self.filter_queryset(sent_feedback))
        if page is not None:
            serializer = FeedbackSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        sent_feedback = self.filter_queryset(sent_feedback)
        serializer = FeedbackSerializer(sent_feedback, many=True)
        return Response(serializer.data)

    @list_route(methods=['GET'], url_path='feedback-as-receiver')
    def feedback_as_receiver(self, request, *args, **kwargs):
        """
        This view returns all the feedback the user has received.
        """
        received_feedback = Feedback.objects.filter(
            recipient=self.request.user, status=Feedback.COMPLETE)
        page = self.paginate_queryset(self.filter_queryset(received_feedback))
        if page is not None:
            serializer = FeedbackSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        received_feedback = self.filter_queryset(received_feedback)
        serializer = FeedbackSerializer(received_feedback, many=True)
        return Response(serializer.data)


class ExtraUserInfoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = ExtraUserInfo.objects.all()
    serializer_class = ExtraUserInfoSerializer


class ExtraUserInfoCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = ExtraUserInfoCategory.objects.all()
    serializer_class = ExtraUserInfoCategorySerializer


class GetUserByRequest(viewsets.ViewSet):
    """
    API endpoint that returns a user object of the logged in user.
    """

    def list(self, request):
        queryset = User.objects.filter(email=self.request.user.email)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return User.objects.filter(email=self.request.user.email)
