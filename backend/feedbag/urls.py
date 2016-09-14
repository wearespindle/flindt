from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework.authtoken import views

from feedbag.api.urls import router

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^api-social-auth/', include('rest_framework_social_oauth2.urls')),
    url(r'^api-token-auth/', views.obtain_auth_token),
    url(r'^auth/', include('rest_framework_social_oauth2.urls')),
    url(r'^jet/', include('jet.urls', 'jet')),  # Django JET URLS
]

if settings.DEBUG and settings.MEDIA_ROOT:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
