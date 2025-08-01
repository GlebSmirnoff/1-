
from django.contrib import admin
from django.urls import path, include
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail import urls as wagtail_urls
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', include('main.urls')),
    path('admin/', admin.site.urls),
    path('cms/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
    path('auth/', include('users.urls')),
    path('api/listings/', include('listing.urls')),
    path('api/auth/', include('users.urls')),
    path("api/assistant/", include("assistant.urls")),
    path('', include(wagtail_urls)),
    path('api/', include('users.urls')),



]