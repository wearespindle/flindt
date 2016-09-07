from rest_framework import serializers

from .models import Rating, Remark, Question, Feedback, FeedbackOnIndividual, FeedbackOnRole


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'description',)


class RemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remark
        fields = ('id', 'rating', 'content',)


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'name', 'content')


class FeedbackOnIndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackOnIndividual
        fields = ('id', 'question', 'answer')


class FeedbackOnRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackOnRole
        fields = ('id', 'role', 'remark')


class FeedbackSerializer(serializers.ModelSerializer):
    individual = FeedbackOnIndividualSerializer(read_only=True)
    role = FeedbackOnRoleSerializer(read_only=True)

    def validate(self, attrs):
        individual_feedback = attrs.get('individual')

        if self.instance and not individual_feedback:
            individual_feedback = self.instance.individual

        role_feedback = attrs.get('role')

        if self.instance and not role_feedback:
            role_feedback = self.instance.role

        # We want either individual or role feedback.
        # So return an error if both or none are set.
        if (individual_feedback and role_feedback) or (not individual_feedback and not role_feedback):
            raise serializers.ValidationError('Please provide either individual or role feedback.')

        return super(FeedbackSerializer, self).validate(attrs)

    class Meta:
        model = Feedback
        fields = (
            'id',
            'date',
            'recipient',
            'sender',
            'status',
            'how_recognizable',
            'how_valuable',
            'actionable',
            'actionable_content',
            'individual',
            'role',
        )
        depth = 1
