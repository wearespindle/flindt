from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone

from rest_framework import viewsets, status
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView

from flindt.role.models import Role
from flindt.round.models import Round
from flindt.user.models import User

from .models import Feedback, FeedbackOnRole, Question, Rating, Remark
from .serializers import FeedbackSerializer, QuestionSerializer, RatingSerializer, RemarkSerializer


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer


class RemarkViewSet(viewsets.ModelViewSet):
    queryset = Remark.objects.all()
    serializer_class = RemarkSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows questions to be viewed or added.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        """
        Set the queryset here so it filters on user.
        """
        return super(FeedbackViewSet, self).get_queryset().filter(Q(sender=self.request.user) |
                                                                  Q(recipient=self.request.user))


class FeedbackAskBase(APIView):
    """
    Base class for asking feedback.
    """
    renderer_classes = (JSONRenderer, )

    def get_queryset(self):
        """
        Filter to only have the logged in user available.

        Returns:
            Queryset with the found Users based on the email address.
        """
        return User.objects.filter(email=self.request.user.email)


class FeedbackAsk(FeedbackAskBase):

    def post(self, request):
        # When the request is not a post request return 400 bad request.
        if self.request.method != "POST":
            return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)

        data = self.request.data

        if len(data) == 0:
            return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)

        feedback_from_person_id = data.get('feedbackFromPersonId', None)
        feedback_on_role_id = data.get('feedbackOnRoleId', None)

        # When feedback_from_person_id or feedback_on_role_id is None return a
        # 400 bad request.
        if not feedback_from_person_id or not feedback_on_role_id:
            return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)

        # Get the send based on the feedback_on_role_id.
        sender = User.objects.get(pk=feedback_from_person_id)

        # Get the role based on the feedback_on_role_id
        role = Role.objects.get(pk=feedback_on_role_id)

        # Get the the Round based on the logged in user.
        try:
            round_object = Round.objects.get(participants_receivers__in=[self.request.user.pk])
        except Round.DoesNotExsist:
            # When there is nothing found return a 404
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        # First create the FeedbackOnRole object based on the role and set
        # the requested parameter to True.
        feedback_on_role = FeedbackOnRole(role=role, requested=True)
        feedback = Feedback(
            actionable=False,
            recipient=self.request.user,
            sender=sender,
            date=timezone.now(),
            role=feedback_on_role,
            round=round_object
        )
        # Save the role on the feedback first.
        feedback.role.save()
        # Re-set the role on the feedback object.
        feedback.role = feedback.role
        # Save the feedback object again.
        feedback.save()
        return JsonResponse({}, status=status.HTTP_200_OK)


class FeedbackAskCircles(FeedbackAskBase):
    def get(self, request):
        """
        Get the circles the user is in.

        Args:
            request (UWSGI Request): The uwsgi request object.

        Returns:
            - Either a 404 if no circles are found.
            - Or a JSON Response which looks as follows
                {
                    'circles': [
                        { 'id': 1, name: 'Circle name', }
                        { 'id': 2, name: 'Circle name 2', }
                    ]
                }
        """
        # Get all the roles the user is part off.
        roles = Role.objects.filter(users__in=[self.request.user.pk], archived=False)

        if not roles:
            # When there is nothing found return a 404
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        done_circles = []
        response_dict = {
            'circles': [],
        }

        # Loop over the roles.
        for role in roles:
            # Check if the parent has a role
            if not role.parent:
                continue

            # Check if the role has a parent and check if that parent actually is a circle.
            # And that the circle is not archived.
            # And also if the circle is not already processed to prevent duplicate entries.
            if role.parent.is_circle and not role.parent.archived and role.parent.id not in done_circles:
                # Get the circle of the role.
                circle_parent = role.parent
                # Get the name of the circle.
                name = circle_parent.name

                # If the circle has another parent add the parent fo the circle between braces.
                if circle_parent.parent:
                    name = '{} ({})'.format(circle_parent.name, circle_parent.parent.name)

                circle_dict = {
                    'id': role.parent.id,
                    'name': name,
                }

                response_dict['circles'].append(circle_dict)
                # Add the id of the circle to list of already processed circles.
                done_circles.append(role.parent.id)

        # Sort the circles based on the name key.
        response_dict['circles'].sort(key=lambda x: x['name'], reverse=False)

        return JsonResponse(response_dict, status=status.HTTP_200_OK)


class FeedbackAskRoles(FeedbackAskBase):
    def get(self, request, circle_id):
        """
        Get the circles the user is in.

        Args:
            request (UWSGI Request): The uwsgi request object.
            circle_id (int): The id of a circle to get roles which the
                user fulfills.

        Returns:
            - Either a 404 if no circles for the user are found.
            - Or a JSON Response which looks as follows
                {
                    'roles': [
                        { 'id': 1, name: 'Role name', }
                        { 'id': 2, name: 'Role name 2', }
                    ]
                }
        """
        # Get the circle based on the given circle_id which is not archived.
        try:
            circle = Role.objects.get(id=circle_id, archived=False)
        except Role.DoesNotExsist:
            # When there is nothing found return a 404
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        # Get all roles (children) from the circle where the user is in.
        roles = circle.children.filter(users__in=[self.request.user.pk])

        # When there are no roles found return a 404.
        if not roles:
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        response_dict = {
            'roles': [],
        }

        for role in roles:
            circle_dict = {
                'id': role.id,
                'name': role.name
            }
            response_dict['roles'].append(circle_dict)

        # Sort the roles based on the name key.
        response_dict['roles'].sort(key=lambda x: x['name'], reverse=False)

        return JsonResponse(response_dict, status=status.HTTP_200_OK)


class FeedbackAskPerson(FeedbackAskBase):
    """
    API Endpoint for asking feedback from a person.
    """
    def get(self, request, circle_id):
        """
        Get the persons in a circle with the given circle id.

        Args:
            request (UWSGI Request): The uwsgi request object.
            circle_id (int): The id of a circle to get the persons
                in that circle.

        Returns:
            - Either a 404 if no persons in the circle are found.
            - Or a JSON Response which looks as follows
                {
                    'roles': [
                        { 'id': 1, name: 'Person name', }
                        { 'id': 2, name: 'Person name 2', }
                    ]
                }
        """
        # Get the circle based on the given circle_id which is not archived.
        try:
            circle = Role.objects.get(id=circle_id, archived=False)
        except Role.DoesNotExsist:
            # When there is nothing found return a 404
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        # Get all roles (children) from the circle.
        roles = circle.children.all()

        # When there are no roles found return a 404.
        if not roles:
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        persons_done = []
        response_dict = {
            'persons': [],
        }

        # Loop over all the roles.
        for role in roles:
            # Loop over all the person in the role.
            for person in role.users.all():
                # Check if the user is not already in the list to prevent adding
                # users who have multiple roles in the circle.
                if person.pk != self.request.user.pk and person.pk not in persons_done:

                    # Add the person id and first name, last name to the circle_dict.
                    circle_dict = {
                        'id': person.pk,
                        'name': person.get_short_name(),
                    }

                    # Append the circle dict to the response dict.
                    response_dict['persons'].append(circle_dict)

                    # Add the person id to list of persons that has already been checked.
                    persons_done.append(person.pk)

        # When there are no persons in the circle return a 404.
        if len(response_dict['persons']) == 0:
            return JsonResponse({}, status=status.HTTP_404_NOT_FOUND)

        # Sort the persons based on the name key.
        response_dict['persons'].sort(key=lambda x: x['name'], reverse=False)

        return JsonResponse(response_dict, status=status.HTTP_200_OK)
