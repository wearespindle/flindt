from rest_framework import serializers
from django.utils import timezone

from .models import Happiness


class HappinessSerializer(serializers.ModelSerializer):

    date = serializers.DateTimeField(
        read_only=True,
        default=timezone.now
    )

    user = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Happiness
        fields = ('id', 'user', 'date', 'happiness', 'description')
