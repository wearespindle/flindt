from rest_framework import serializers

from .models import Role


class RoleSerializer(serializers.ModelSerializer):
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
        depth = 1
