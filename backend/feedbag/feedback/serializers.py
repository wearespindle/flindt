from rest_framework import serializers

from .models import Rating, Remark, Question, Feedback, FeedbackOnIndividual, FeedbackOnRole
from feedbag.role.serializers import RoleSerializer


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'description',)


class RemarkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Remark
        fields = ('id', 'rating', 'content',)
        depth = 1


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'name', 'content')


class FeedbackOnIndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackOnIndividual
        fields = ('id', 'question', 'answer')


class FeedbackOnRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer()
    remarks = RemarkSerializer(many=True)

    class Meta:
        model = FeedbackOnRole
        fields = ('id', 'role', 'remarks')


class FeedbackSerializer(serializers.ModelSerializer):
    individual = FeedbackOnIndividualSerializer()
    role = FeedbackOnRoleSerializer()

    def update(self, instance, validated_data):
        individual_feedback = validated_data.pop('individual', None)
        role_feedback = validated_data.pop('role', None)

        if individual_feedback:
            # We only want the answer of individual feedback to be editable.
            answer = individual_feedback.get('answer')
            if not answer:
                raise serializers.ValidationError('Please provide an answer')

            instance.individual.answer = answer
            instance.individual.save()
        elif role_feedback:
            remarks = role_feedback.get('remarks')

            if not remarks:
                raise serializers.ValidationError('Please provide remarks')

            for remark in remarks:
                if remark.get('id'):
                    # Existing remark, so update it.
                    role_remark = instance.role.remarks.get(id=remark.get('id'))
                    role_remark.content = remark.get('content')
                    role_remark.save()
                else:
                    # New remark, so create a new one and add to the set.
                    instance.role.remarks.create(**remark)

        for (key, value) in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance

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
