from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin

from feedbag.api.urls import router

admin.autodiscover()

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),

    url(r'^api-auth/', include('rest_framework.urls')),

    url(r'^admin/', admin.site.urls),
]


if settings.DEBUG and settings.MEDIA_ROOT:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
