from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path
from rest_framework.authtoken import views

from flindt.api.urls import router

urlpatterns = [
    re_path('^api/v1/', include(router.urls)),
    re_path('^api/v1/feedback/', include('flindt.feedback.urls')),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-social-auth/', include('rest_framework_social_oauth2.urls')),
    path('api-token-auth/', views.obtain_auth_token),
    path('auth/', include('rest_framework_social_oauth2.urls')),
    path('jet/', include('jet.urls', 'jet')),
]

if settings.DEBUG and settings.MEDIA_ROOT:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
