from django.test import TestCase

from .factories import FeedbackFactory


class FeedbackTestCase(TestCase):
    """
    Used to confirm the correct behaviour of Role methods.
    """

    def setUp(self):
        self.feedback = FeedbackFactory()

    def test_has_feedback(self):
        """
        Test if the feedback object has feedback.
        """
        has_feedback = any([self.feedback.individual, self.feedback.role])
        self.assertTrue(has_feedback)

    def test_invalid_feedback(self):
        """
        Test if having both types of feedback raises an error.
        """
        # if self.feedback.individual:
        #     role_feedback = FeedbackOnRoleFactory()
        #     self.feedback.role = role_feedback
        # else:
        #     individual_feedback = FeedbackOnIndividualFactory()
        #     self.feedback.individual = individual_feedback
        #
        # self.assertRaises(ValidationError)
        pass
