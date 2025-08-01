from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ListingTipsViewSet

router = DefaultRouter()
router.register(r'listing/tips', ListingTipsViewSet, basename='listing-tips')

urlpatterns = [
    # /ai/assistant/…
    path('', include(router.urls)),
]