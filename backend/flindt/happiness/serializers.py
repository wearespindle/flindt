from rest_framework import serializers

from .models import Happiness


class HappinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Happiness
        fields = ('id', 'user', 'date', 'happiness', 'description')
