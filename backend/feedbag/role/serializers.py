from rest_framework import serializers

from .models import Role


class ParentRoleSerializer(serializers.ModelSerializer):
    """
    Because we want to represent parent as a role, but a serializer/object can
    not reference itself, ParentRoleSerializer is defined. This serializer is
    in fact pretty much the same as :class:`RoleSerializer`.
    """
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
