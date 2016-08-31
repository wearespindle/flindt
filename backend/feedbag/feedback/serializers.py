from rest_framework import serializers

from .models import Rating, Remark, Question


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('pk', 'name', 'description',)


class RemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remark
        fields = ('pk', 'rating', 'content',)


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('pk', 'name', 'content')
