from django.test import TestCase

from .factories import RoleFactory


class RoleTestCase(TestCase):
    """
    Used to confirm the correct behaviour of Role methods.
    """

    def setUp(self):
        self.anchor_circle = RoleFactory()
        self.circle = RoleFactory(parent=self.anchor_circle)
        self.role = RoleFactory(parent=self.circle)

    def test_is_anchor(self):
<<<<<<< 131e9df3da671c21b792775a46c17f840c7bb9b8
        """
        Test the is_anchor method for Role model.
        """
=======
>>>>>>> FEED-17: Add the Role model
        self.assertTrue(self.anchor_circle.is_anchor)
        self.assertFalse(self.circle.is_anchor)
        self.assertFalse(self.role.is_anchor)

    def test_is_circle(self):
<<<<<<< 131e9df3da671c21b792775a46c17f840c7bb9b8
        """
        Test the is_circle method for Role model.
        """
=======
>>>>>>> FEED-17: Add the Role model
        self.assertTrue(self.anchor_circle.is_circle)
        self.assertTrue(self.circle.is_circle)
        self.assertFalse(self.role.is_circle)
