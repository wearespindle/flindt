# To understand the customized Django User model, see:
# https://docs.djangoproject.com/en/dev/topics/auth/customizing/#
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import ugettext as _

from flindt.base.models import FlindtBaseModel


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, username=None):
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(PermissionsMixin, AbstractBaseUser):
    USERNAME_FIELD = 'email'

    email = models.EmailField(
        unique=True
    )
    first_name = models.CharField(
        max_length=255,
        blank=True,
    )
    last_name = models.CharField(
        max_length=255,
        blank=True
    )
    prefix = models.CharField(
        max_length=255,
        blank=True,
    )
    # TODO: FEED-26: Use ExtraUserInfo for the glassfrog_id. That way we can
    # cleanly extend the import to work for Nestr et al.
    glassfrog_id = models.IntegerField(
        blank=True,
        null=True,
    )
    slack_user_name = models.CharField(
        blank=True,
        max_length=255,
    )
    extra_info = models.ManyToManyField(
        'ExtraUserInfo',
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    def get_full_name(self):
        return "%s" % self.first_name

    def get_short_name(self):
        return "%s %s" % (self.first_name, self.last_name)

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # TODO: FEED-27: Implement the correct permission system.
        # Simplest possible answer for now: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class ExtraUserInfo(FlindtBaseModel):
    """
    Used to link extra user information to a user. This can be used to add
    arbitrary information on a user. It also features a category, so that
    information can be presented with a corresponding category.

    Example:
        This can be used to link a DISC profile to a user like so:

        >>> category = ExtraUserInfoCategory.objects.create(name='DISC profile')
        >>> extrauserinfo = ExtraUserInfo.object.create(category=category,link='http://example.com/keycardforjohndoe')
        >>> User.objects.create(extra_info=[extrauserinfo], first_name='John', last_name='Doe')
    """
    category = models.ForeignKey(
        'ExtraUserInfoCategory',
    )
    link = models.URLField(
        _('link'),
        blank=True,
    )
    description = models.TextField(
        _('description'),
        blank=True,
    )

    def __str__(self):
        ret = '{category}: {info}'
        if self.link:
            return ret.format(category=self.category, info=self.link)
        if self.description:
            return ret.format(category=self.category, info=self.description)
        else:
            return ret.format(category=self.category, info='empty')


class ExtraUserInfoCategory(FlindtBaseModel):
    """
    Provide a category for extrauserinfo.
    """
    name = models.CharField(
        _('name'),
        max_length=255,
    )

    def __str__(self):
        return self.name
