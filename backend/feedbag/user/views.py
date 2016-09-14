from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from feedbag.feedback.models import Feedback
from feedbag.feedback.serializers import FeedbackSerializer

from django.shortcuts import get_object_or_404

from .models import User, ExtraUserInfo, ExtraUserInfoCategory
from .serializers import UserSerializer, ExtraUserInfoSerializer, ExtraUserInfoCategorySerializer

from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @list_route(methods=['GET'], url_path='feedback-as-sender')
    def feedback_as_sender(self, request, *args, **kwargs):
        """
        This view returns all the feedback the user has sent.
        """
        sent_feedback = Feedback.objects.filter(sender=self.request.user)
        serializer = FeedbackSerializer(sent_feedback, many=True)

        return Response(serializer.data)

    @list_route(methods=['GET'], url_path='feedback-as-receiver')
    def feedback_as_receiver(self, request, *args, **kwargs):
        """
        This view returns all the feedback the user has received.
        """
        received_feedback = Feedback.objects.filter(recipient=self.request.user)
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
