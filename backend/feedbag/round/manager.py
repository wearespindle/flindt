from collections import Counter
from itertools import dropwhile
from random import shuffle

from django.utils import timezone
from feedbag.feedback.models import FeedbackOnRole, Feedback, FeedbackOnIndividual, Question

from feedbag.user.models import User


class MatchNotFoundError(Exception):
    pass


class NoSolutionFound(Exception):
    pass


class RoundManager:
    counter = 0
    tries = 0
    max_depth = 0
    round = None
    role_feedback = []
    individual_feedback = []
    users_giving_feedback = None
    users_have_given_feedback_on_role = Counter()
    users_have_given_feedback_on_individual = Counter()
    users_in_circle = {}
    max_reviews_per_user = 0

    def __init__(self, round):
        self.round = round
        self.users_giving_feedback = set(self.round.participants_senders.all().values_list('id', flat=True))

    def start_round(self):
        # We do a maximum of tries that is equal to number of users giving feeback
        for i in range(len(self.users_giving_feedback)):
            # After every 3th try to fix the round, we increment the number of reviews that needs to be given
            self.max_reviews_per_user = self.round.roles_to_review + i // 3
            try:
                print('')
                print('Solution {}, max number of reviews: {}'.format(i, self.max_reviews_per_user))
                self._create_feedback_for_participants()
                self._sort_feedback_on_circle_size()
                self._match_role_feedback_to_senders(self.role_feedback)
                break
            except (NoSolutionFound, MatchNotFoundError):
                # reset the round
                self.counter = 0
                self.tries = 0
                self.max_depth = 0
                self.users_have_given_feedback_on_role = Counter()

    def _create_feedback_for_participants(self):
        self.role_feedback = []
        for participant in self.round.participants_receivers.all():
            # TODO: make sure all roles are different
            for x in range(0, self.round.roles_to_review):
                feedback = self._create_role_feedback_for_participant(participant)
                if feedback:
                    self.role_feedback.append(feedback)
            for x in range(0, self.round.individuals_to_review):
                feedback = self._create_individual_for_participant(participant)
                if feedback:
                    self.individual_feedback.append(feedback)

    def _create_role_feedback_for_participant(self, participant):
        role = participant.role_set.order_by('?').exclude(parent__isnull=True).first()
        if not role:
            return
        feedback_on_role = FeedbackOnRole(role=role)
        feedback = Feedback(
            actionable=False,
            round=self.round,
            recipient=participant,
            date=timezone.now(),
            role=feedback_on_role,
        )
        return feedback

    def _create_individual_for_participant(self, participant):
        question = Question.objects.order_by('?').first()
        feedback_on_individual = FeedbackOnIndividual(
            question=question,
        )
        feedback = Feedback(
            actionable=False,
            round=self.round,
            recipient=participant,
            date=timezone.now(),
            individual=feedback_on_individual,
        )
        return feedback

    def _sort_feedback_on_circle_size(self):
        for feedback in self.role_feedback:
            feedback._circle_size = len(self._get_senders_for_user_in_role(
                feedback.role.role.parent
            ))
        sorted(
            self.role_feedback,
            key=lambda feedback: feedback._circle_size,
            reverse=True,
        )

    def _get_senders_for_user_in_role(self, circle):
        if circle.pk in self.users_in_circle:
            return self.users_in_circle[circle.pk]
        else:
            users = set(User.objects.filter(
                role__parent_id=circle.pk,
            ).filter(
                id__in=self.users_giving_feedback,
            ).values_list('id', flat=True))
            self.users_in_circle[circle.pk] = users
            return users

    def _match_role_feedback_to_senders(self, feedbacks):

        # Base case, no feedback to give
        if not feedbacks:
            return

        feedback = feedbacks[0]

        senders = self._get_senders_for_user_in_role(feedback.role.role.parent).copy()

        senders.remove(feedback.recipient.id)

        users_done = self.users_have_given_feedback_on_role.copy()
        for key, count in dropwhile(lambda user: user[1] >= self.max_reviews_per_user, users_done.most_common()):
            del users_done[key]

        senders = list(senders.difference(set(users_done)))
        shuffle(senders)

        matched_sender = None

        for sender in senders:
            matched_sender = sender
            self.users_have_given_feedback_on_role[sender] += 1

            try:
                self.tries += 1
                self.counter += 1
                self.max_depth = max(self.counter, self.max_depth)
                if self.tries % 10000 == 0:
                    print('(tries: {}, max depth: {}) counter: {}{}'.format(
                        self.tries,
                        self.max_depth,
                        self.counter * '#',
                        ' '*100
                    ), end='\r')
                self._match_role_feedback_to_senders(feedbacks[1:])
            except MatchNotFoundError:
                self.counter -= 1
                self.users_have_given_feedback_on_role[sender] -= 1
                matched_sender = None
            else:
                break

        if not matched_sender:
            if self.tries >= 10000:
                raise NoSolutionFound
            else:
                raise MatchNotFoundError

        if feedback.individual:
            feedback.individual.save()
        else:
            feedback.role.save()
        feedback.sender_id = matched_sender
        feedback.save()



def start_rounds(modeladmin, request, queryset):
    for round in queryset.all():
        RoundManager(round)
start_rounds.description = 'Start round'
