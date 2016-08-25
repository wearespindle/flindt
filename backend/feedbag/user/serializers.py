from rest_framework import serializers

from .models import User, ExtraUserInfo, ExtraUserInfoCategory


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'first_name', 'last_name', 'prefix', 'glassfrog_id', 'extra_info')
        depth = 2


class ExtraUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraUserInfo
        fields = ('pk', 'category', 'link', 'description')
        depthy = 1


class ExtraUserInfoCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraUserInfoCategory
        fields = ('pk', 'name',)
