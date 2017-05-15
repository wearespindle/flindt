from rest_framework import serializers

from .models import User, ExtraUserInfo, ExtraUserInfoCategory
from flindt.happiness.serializers import HappinessSerializer


class UserSerializer(serializers.ModelSerializer):
    happiness_set = HappinessSerializer(many=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'prefix', 'glassfrog_id',
                  'happiness_set', 'extra_info')


class ExtraUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraUserInfo
        fields = ('id', 'category', 'link', 'description')
        depth = 1


class ExtraUserInfoCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraUserInfoCategory
        fields = ('id', 'name',)
