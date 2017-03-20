from django.db import models
from flindt.base.models import FlindtBaseModel
from flindt.role.models import Role


class RoleImportRun(FlindtBaseModel):
    """
    RoleImport is used to relate import roles to a specific import run.
    """
    started = models.DateTimeField(auto_now=True)
    roles = models.ManyToManyField(Role)

    def __str__(self):
        return "import started at {}".format(self.started)
