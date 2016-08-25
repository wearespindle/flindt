from rest_framework import serializers

from .models import Rating, Remark


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('pk', 'name', 'description',)


class RemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remark
        fields = ('pk', 'rating', 'content',)
