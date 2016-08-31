from rest_framework import routers

# This way of import views, does not feel good.
from feedbag.user import views as user_views
from feedbag.feedback import views as feedback_views
from feedbag.question import views as question_views


router = routers.DefaultRouter()
router.register(r'users', user_views.UserViewSet)
router.register(r'extrauserinfos', user_views.ExtraUserInfoViewSet)
router.register(r'extrauserinfocategories', user_views.ExtraUserInfoCategoryViewSet)
router.register(r'extrauserinfocategories', user_views.ExtraUserInfoCategoryViewSet)

router.register(r'ratings', feedback_views.RatingViewSet)
router.register(r'remarks', feedback_views.RemarkViewSet)
router.register(r'questions', question_views.QuestionViewSet)
