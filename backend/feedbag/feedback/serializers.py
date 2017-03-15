from datetime import datetime, timedelta, timezone

from rest_framework import serializers

from feedbag.role.serializers import RoleSerializer
from feedbag.user.serializers import UserSerializer
from feedbag.round.serializers import RoundSerializer

from .models import Rating, Remark, Question, Feedback, FeedbackOnIndividual, FeedbackOnRole


class RatingSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, required=False, allow_null=True)
    rating_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Rating
        fields = ('id', 'name', 'image', 'description', 'rating_id', )


class RemarkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    rating = RatingSerializer()

    class Meta:
        model = Remark
        fields = ('id', 'rating', 'content',)


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'name', 'content')


class FeedbackOnIndividualSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

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
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    round = RoundSerializer(read_only=True)

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
                    rating = Rating.objects.get(pk=remark.pop('rating').get('rating_id'))
                    remark['rating'] = rating
                    instance.role.remarks.create(**remark)

        for (key, value) in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance

    def validate(self, attrs):
        if self.instance:
            if self.instance.round:
                # Round isn't a required field, so only check for end date if there's a round.
                feedback_closed = datetime.now(timezone.utc) > self.instance.round.end_date
            else:
                # Otherwise we expire editing of feedback after 7 days.
                feedback_closed = self.instance.date + timedelta(days=7) < datetime.now(timezone.utc)

            if feedback_closed:
                raise serializers.ValidationError('This feedback has been finalized \
                and you can\'t edit this feedback anymore.')

        individual_feedback = attrs.get('individual')

        if self.instance and not individual_feedback:
            individual_feedback = self.instance.individual

        role_feedback = attrs.get('role')

        if self.instance and not role_feedback:
            role_feedback = self.instance.role

        if not self.partial:
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
            'round',
        )
        read_only_fields = ('date', 'round',)
