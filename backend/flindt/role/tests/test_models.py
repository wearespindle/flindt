from django.test import TestCase

from flindt.role.factories import RoleFactory


class RoleTestCase(TestCase):
    """
    Used to confirm the correct behaviour of Role methods.
    """

    def setUp(self):
        self.anchor_circle = RoleFactory()
        self.circle = RoleFactory(parent=self.anchor_circle)
        self.role = RoleFactory(parent=self.circle)

    def test_is_anchor(self):
        """
        Test the is_anchor method for Role model.
        """
        self.assertTrue(self.anchor_circle.is_anchor)
        self.assertFalse(self.circle.is_anchor)
        self.assertFalse(self.role.is_anchor)

    def test_is_circle(self):
        """
        Test the is_circle method for Role model.
        """
        self.assertTrue(self.anchor_circle.is_circle)
        self.assertTrue(self.circle.is_circle)
        self.assertFalse(self.role.is_circle)
