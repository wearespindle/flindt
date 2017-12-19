import json

from rest_framework import serializers

from .models import Role


class ParentRoleSerializer(serializers.ModelSerializer):
    """
    Because we want to represent parent as a role, but a serializer/object can
    not reference itself, ParentRoleSerializer is defined. This serializer is
    in fact pretty much the same as :class:`RoleSerializer`.
    """
    # Override the default accountabilities serializer with SerializerMethodField to override the getter.
    accountabilities = serializers.SerializerMethodField()
    # Override the default domains serializer with SerializerMethodField to override the getter.
    domains = serializers.SerializerMethodField()

    def get_accountabilities(self, obj):
        """
        Override the getter for accountabilities to try and convert the domains to a
        correct json format.
        """

        # Try to load the obj.accountabilities as a json. If this fails return the
        # string.
        try:
            return json.loads(obj.accountabilities)
        except ValueError:
            return obj.accountabilities

    def get_domains(self, obj):
        """
        Override the getter for domains to try and convert the domains to a
        correct json format.
        """

        # Try to load the obj.domains as a json. If this fails return the
        # string.
        try:
            return json.loads(obj.domains)
        except ValueError:
            return obj.domains

    class Meta:
        model = Role
        fields = (
            'id',
            'name',
            'purpose',
            'accountabilities',
            'domains',
            'parent',
            'users',
            'archived',
        )


class RoleSerializer(serializers.ModelSerializer):
    parent = ParentRoleSerializer()
    # Override the default accountabilities serializer with
    # SerializerMethodField to override the getter.
    accountabilities = serializers.SerializerMethodField()
    # Override the default domains serializer with
    # SerializerMethodField to override the getter.
    domains = serializers.SerializerMethodField()

    def get_accountabilities(self, obj):
        """
        Override the getter for accountabilities to try and convert the domains to a
        correct json format.
        """

        # Try to load the obj.accountabilities as a json. If this fails return the
        # string.
        try:
            return json.loads(obj.accountabilities)
        except ValueError:
            return obj.accountabilities

    def get_domains(self, obj):
        """
        Override the getter for domains to try and convert the domains to a
        correct json format.
        """

        # Try to load the obj.domains as a json. If this fails return the
        # string.
        try:
            return json.loads(obj.domains)
        except ValueError:
            return obj.domains

    class Meta:
        model = Role
        fields = (
            'id',
            'name',
            'purpose',
            'accountabilities',
            'domains',
            'parent',
            'users',
            'archived',
        )
