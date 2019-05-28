from collections import Counter
from itertools import dropwhile
import logging
from random import shuffle

from django.utils import timezone

from flindt.feedback.models import (Feedback, FeedbackOnIndividual, FeedbackOnRole)
from flindt.user.models import User

logger = logging.getLogger(__name__)


class IntegrationError(Exception):
    pass


class MatchNotFoundError(Exception):
    pass


class NoSolutionFound(Exception):
    pass


class NoSolutionPossible(Exception):
    pass


class UserInformationNotComplete(Exception):
    def __init__(self, data):
        super(Exception, self).__init__()
        self.data = data


class RoundManager:
    """
    Manager that makes starting a round possible.

    When initializing the class, a Round object is needed.
    When you want to create a round, use `start_round`. This will try to
    create feedback objects for every receiver and sender associated with the round.
    It will raise NoSolutionFound if no solution could be found in a reasonable amount of tries.
    It will raise NoSolutionPossible if there is no solution possible (eg. when
    a user has no roles within a circle).
    It will raise IntegrationError when messaging integrations fail.
    """
    def __init__(self, _round):
        # Current depth of solution.
        self.counter = 0
        # Total number of solutions tried.
        self.tries = 0
        # Max solution depth achieved.
        self.max_depth = 0
        # The Round object.
        self.round = _round
        # All role feedback objects created.
        self.role_feedback = []
        # All individual feedback created.
        self.individual_feedback_to_be_received = []
        # The users giving feedback.
        self.users_giving_feedback = set(_round.participants_senders.all().values_list('id', flat=True))
        # Counter that keeps track how often a user has given feedback on roles.
        self.users_have_given_feedback_on_role = Counter()
        # Counter that keeps track how often a user has given feedback on individuals.
        self.users_have_given_feedback_on_individual = Counter()
        # Caching of users in particular circle.
        self.users_in_circle = {}
        # Keeps track on what the maximum number of feedback a user is allowed to give.
        # Will increase if no solution can be found.
        self.max_reviews_per_user = 0

    def start_round(self):
        """
        This will try to create feedback objects for every receiver and sender
        associated with the round.
        It will raise NoSolutionFound if no solution could be found in a
        reasonable amount of tries.
        It will raise NoSolutionPossible if there is no solution possible
        (eg. when a user has no roles within a circle).
        """
        # We do a maximum of tries that is equal to number of users giving feedback.
        logger.info('starting a new round: {}'.format(self.round))

        # Check that users are in a role.
        users_without_roles = self.do_all_users_have_a_role()

        # Check that users have a correct slack id.
        users_without_slack_id = self.do_all_users_have_a_slack_id()

        # When there a users without a role or the slack id is not present/correct
        # raise an exception.
        if users_without_roles or users_without_slack_id:
            user_exception_data = {
                'without_role': users_without_roles,
                'without_slack_id': users_without_slack_id,
            }
            raise UserInformationNotComplete(data=user_exception_data)

        for i in range(self.round.min_feedback_sent + 100):
            # After every 3th try to fix the round, we increment the maximum number of reviews that needs to be given.
            self.max_reviews_per_user = self.round.roles_to_review + i // 3
            try:
                logger.info('Trying to create role feedback {}th try, max number of reviews: {}'.format(
                    i + 1, self.max_reviews_per_user)
                )
                self._create_role_feedback_for_participants()
                self._sort_feedback_on_circle_size()
                self._match_role_feedback_to_senders(self.role_feedback)
                logger.info('Successfully matched all role feedback on the {}th try'.format(i + 1))
                break
            except (NoSolutionFound, MatchNotFoundError):
                # reset the round
                self.counter = 0
                self.tries = 0
                self.max_depth = 0
                self.users_have_given_feedback_on_role = Counter()

        for i in range(10000):
            self.max_reviews_per_user = self.round.individuals_to_review + i // 3
            try:
                logger.info('Trying to create individual feedback Solution {}th try, max number of reviews: {}'.format(
                    i + 1, self.max_reviews_per_user)
                )
                self._create_individual_feedback_for_participants()
                self._match_individual_feedback_to_senders(self.individual_feedback_to_be_received)
                logger.info('Successfully matched all individual feedback on the {}th try'.format(i + 1))
                break
            except (NoSolutionFound, MatchNotFoundError):
                # reset the round
                self.counter = 0
                self.tries = 0
                self.max_depth = 0
                self.users_have_given_feedback_on_individual = Counter()

        logger.info('New round started.')

    def do_all_users_have_a_role(self):
        receivers = self.round.participants_receivers.all()
        senders = self.round.participants_senders.all()

        users_without_role = []
        for receiver in receivers:
            role = receiver.role_set.exclude(parent_id=None).exclude(archived=True).first()
            if not role:
                users_without_role.append(receiver.email)

        for sender in senders:
            role = sender.role_set.exclude(parent_id=None).exclude(archived=True).first()
            if not role and not sender.email in users_without_role:
                users_without_role.append(sender.email)

        return users_without_role

    def do_all_users_have_a_slack_id(self):
        receivers = self.round.participants_receivers.all()
        senders = self.round.participants_senders.all()

        users_without_slack_id = []

        for receiver in receivers:
            slack_user_name = receiver.slack_user_name
            if not slack_user_name or not slack_user_name.startswith('U'):
                invalid_user = receiver.email
                if slack_user_name and not slack_user_name.startswith('U'):
                    invalid_user = '{} ({})'.format(invalid_user, slack_user_name)
                users_without_slack_id.append(invalid_user)

        for sender in senders:
            slack_user_name = sender.slack_user_name
            if not slack_user_name or not slack_user_name.startswith('U'):
                invalid_user = sender.email
                if slack_user_name and not slack_user_name.startswith('U'):
                    invalid_user = '{} ({})'.format(invalid_user, slack_user_name)
                if invalid_user not in users_without_slack_id:
                    users_without_slack_id.append(invalid_user)

        return users_without_slack_id

    def _create_role_feedback_for_participants(self):
        """
        This will create Feedback + FeedbackOnRole objects for every participant.
        """
        self.role_feedback = []
        for participant in self.round.participants_receivers.all():
            # TODO: FEED-60: Make sure all roles are different.
            for _ in range(self.round.roles_to_review):
                feedback = self._create_role_feedback_for_participant(participant)
                if feedback:
                    self.role_feedback.append(feedback)

    def _create_role_feedback_for_participant(self, participant):
        """
        This will create a Feedback + FeedbackOnRole object for the participant.
        Args:
            participant: User object

        Returns:
            Feedback object with FeedbackOnRole object.

        Raises:
            NoSolutionPossible: If no roles can be found for the user.
        """
        logger.info('Creating role feedback for user: {}'.format(participant))
        role = participant.role_set.order_by('?').exclude(parent_id=None).exclude(archived=True).first()
        if not role:
            raise NoSolutionPossible

        feedback_on_role = FeedbackOnRole(role=role)
        feedback = Feedback(
            actionable=True,
            round=self.round,
            recipient=participant,
            date=timezone.now(),
            role=feedback_on_role,
        )
        return feedback

    def _create_individual_feedback_for_participants(self):
        """
        This will create a Feedback + FeedbackForIndividual object for the
        participants and store it in the list
        `self.individual_feedback_to_be_received`.
        """
        self.individual_feedback_to_be_received = []

        for i in range(self.round.individuals_to_review):
            for participant in self.round.participants_receivers.all():
                question = self.round.question_for_individual_feedback
                individual = FeedbackOnIndividual(question=question)
                feedback = Feedback(
                    actionable=True,
                    round=self.round,
                    recipient=participant,
                    date=timezone.now(),
                    individual=individual,
                )
                self.individual_feedback_to_be_received.append(feedback)

    def _sort_feedback_on_circle_size(self):
        """
        This will sort the feedback objects in order of the circle size.

        This makes finding a solution easier, because finding a sender in a small circle is
        less easy than finding them in big circles, so putting small circles first in the
        matching should make finding the solution simpler.
        """
        for feedback in self.role_feedback:
            feedback._circle_size = len(self._get_senders_for_user_in_role(feedback.role.role.parent))
        sorted(
            self.role_feedback,
            key=lambda feedback: feedback._circle_size,
            reverse=True,
        )

    def _get_senders_for_user_in_role(self, circle):
        """
        Caching function for Users in circles.

        To hit the DB all little less, we cache the users in a circle.

        Arguments:
            circle: Circle object

        Returns:
            User set.
        """
        if circle.pk in self.users_in_circle:
            return self.users_in_circle[circle.pk]
        else:
            users = set(
                User.objects.filter(
                    role__parent_id=circle.pk,
                ).filter(
                    id__in=self.users_giving_feedback,
                ).values_list(
                    'id', flat=True
                )
            )
            self.users_in_circle[circle.pk] = users
            return users

    def _get_senders_for_user(self, user):
        """
        This will find all the users that share a parent circle with ``user``
        and are in the selection of senders for `self.round`. ``user`` will be
        excluded from the result.

        Args:
            user: User object

        Returns:
            User set

        Raises:
            NoSolutionPossible if there are no other users in the circles of the given User.
        """
        circles = list(set(user.role_set.all().values_list('parent_id', flat=True)))

        users = set(User.objects.filter(
            role__parent_id__in=circles,
            id__in=self.round.participants_senders.values_list('id', flat=True)
        ).exclude(
            id=user.id
        ).distinct().values_list(
            'id',
            flat=True,
        ))

        if not users:
            raise NoSolutionPossible

        return users

    def _match_role_feedback_to_senders(self, feedbacks):
        """
        Recursive matching function. This will try to find a sender for the feedback objects.
        Args:
            feedbacks: list of Feedback + FeedbackOnRole objects.

        Raises:
            NoSolutionFound if there is no suitable candidate left to match for the current solution.
            MatchNotFound if the number of solutions tried was bigger than 10.000.
        """
        # Base case, no feedback to give
        if not feedbacks:
            return

        # Get first object from the list.
        feedback = feedbacks[0]

        # Get the circle from the role.
        circle = feedback.role.role.parent

        # Get the users that are in the circle of the recipient of the feedback.
        senders = self._get_senders_for_user_in_role(circle).copy()

        # Remove recipient from the senders. So you won't feedback yourself.
        senders.discard(feedback.recipient.id)

        users_done = self.users_have_given_feedback_on_role.copy()
        # From the list of users that have given feedback, remove the users
        # that have given the maximum number of reviews.
        for key, count in dropwhile(lambda user: user[1] >= self.max_reviews_per_user, users_done.most_common()):
            del users_done[key]

        # Remove the users that have given feedback on the role from the senders list.
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
                    logger.info(
                        '(tries: {}, max depth: {}) counter: {}{}'.format(
                            self.tries, self.max_depth, self.counter * '#', ' ' * 100
                        )
                    )
                # Use the feedbacks objects from 1 and higher to prevent using the same object
                # over and over again.
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

        feedback.role.save()
        # Because role now has an id, set it again on feedback.
        feedback.role = feedback.role
        feedback.sender_id = matched_sender
        feedback.save()

    def _match_individual_feedback_to_senders(self, feedbacks):
        """
        Recursive matching function. This will try to find a sender for the feedback objects.
        Args:
            feedbacks: list of Feedback + FeedbackOnIndividual objects.

        Raises:
            NoSolutionFound if there is no suitable candidate left to match for the current solution.
            MatchNotFound if the number of solutions tried was bigger than 10.000.
        """
        # Base case, no feedback to give.
        if not feedbacks:
            return

        # Get first object from the list.
        feedback = feedbacks[0]

        senders = self._get_senders_for_user(feedback.recipient)

        users_done = self.users_have_given_feedback_on_individual.copy()
        # From the list of users that have given feedback, remove the users
        # that have given the maximum number of reviews.
        for key, _ in dropwhile(lambda user: user[1] >= self.max_reviews_per_user, users_done.most_common()):
            users_done.pop(key)

        # Remove the users that are matched already from the senders list.
        senders = list(senders.difference(set(users_done)))
        shuffle(senders)

        matched_sender = None

        for sender in senders:
            matched_sender = sender
            self.users_have_given_feedback_on_individual[sender] += 1

            try:
                self.tries += 1
                self.counter += 1
                self.max_depth = max(self.counter, self.max_depth)
                if self.tries % 10000 == 0:
                    logger.info(
                        '(tries: {}, max depth: {}) counter: {}{}'.format(
                            self.tries, self.max_depth, self.counter * '#', ' ' * 100
                        )
                    )
                # Use the feedbacks objects from 1 and higher to prevent using the same object
                # over and over again.
                self._match_individual_feedback_to_senders(feedbacks[1:])
            except MatchNotFoundError:
                self.counter -= 1
                self.users_have_given_feedback_on_individual[sender] -= 1
                matched_sender = None
            else:
                break

        if not matched_sender:
            if self.tries >= 10000:
                raise NoSolutionFound
            else:
                raise MatchNotFoundError

        feedback.individual.save()
        # Because individual now has an id, set it again on feedback.
        feedback.individual = feedback.individual
        feedback.sender_id = matched_sender
        feedback.save()
