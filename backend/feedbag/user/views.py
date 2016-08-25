from rest_framework import viewsets

from .models import User, ExtraUserInfo, ExtraUserInfoCategory
from .serializers import UserSerializer, ExtraUserInfoSerializer, ExtraUserInfoCategorySerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


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
