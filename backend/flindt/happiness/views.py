from rest_framework import viewsets
from rest_framework.response import Response

from .models import Happiness
from .serializers import HappinessSerializer


class HappinessViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Happiness.objects.all()
    serializer_class = HappinessSerializer


class GetHappinessByUser(viewsets.ModelViewSet):
    """
    API endpoint that returns a user object of the logged in user.
    """

    serializer_class = HappinessSerializer

    def list(self, request):
        queryset = Happiness.objects.filter(user=self.request.user)
        serializer = HappinessSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return Happiness.objects.filter(user=self.request.user)
