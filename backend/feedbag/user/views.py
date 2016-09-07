from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from feedbag.feedback.models import Feedback
from feedbag.feedback.serializers import FeedbackSerializer

from .models import User, ExtraUserInfo, ExtraUserInfoCategory
from .serializers import UserSerializer, ExtraUserInfoSerializer, ExtraUserInfoCategorySerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @detail_route(methods=['GET'], url_path='feedback-as-sender')
    def feedback_as_sender(self, request, pk):
        """
        This view returns all the feedback the user has sent.
        """
        sent_feedback = Feedback.objects.filter(sender=pk)
        serializer = FeedbackSerializer(sent_feedback, many=True)

        return Response(serializer.data)

    @detail_route(methods=['GET'], url_path='feedback-as-receiver')
    def feedback_as_receiver(self, request, pk):
        """
        This view returns all the feedback the user has received.
        """
        received_feedback = Feedback.objects.filter(recipient=pk)
        serializer = FeedbackSerializer(received_feedback , many=True)

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
