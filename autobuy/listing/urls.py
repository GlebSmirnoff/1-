from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ListingListCreateView, ListingDetailView,
    ListingPhotoUploadView, ListingPhotoDeleteView,
    FavoriteListCreateView, FavoriteDeleteView,
    ListingModerationView, PendingListingsView,
    ApproveListingView, RejectListingView, PromoteListingView,
    BrandViewSet, ModelViewSet, BodyTypeViewSet, EngineViewSet,
    TransmissionViewSet, FuelTypeViewSet, DriveTypeViewSet, ColorViewSet
)

# Роутер для справочников под /refs/
router = DefaultRouter()
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'models', ModelViewSet, basename='model')
router.register(r'body_types', BodyTypeViewSet, basename='bodytype')
router.register(r'engines', EngineViewSet, basename='engine')
router.register(r'transmissions', TransmissionViewSet, basename='transmission')
router.register(r'fuel_types', FuelTypeViewSet, basename='fueltype')
router.register(r'drive_types', DriveTypeViewSet, basename='drivetype')
router.register(r'colors', ColorViewSet, basename='color')

urlpatterns = [
    # CRUD объявления
    path('', ListingListCreateView.as_view(), name='listing-list-create'),
    path('<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),

    # Фото
    path('<int:pk>/photos/upload/', ListingPhotoUploadView.as_view(), name='listing-photo-upload'),
    path('photos/<int:photo_id>/delete/', ListingPhotoDeleteView.as_view(), name='listing-photo-delete'),

    # Избранное
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/<int:pk>/delete/', FavoriteDeleteView.as_view(), name='favorite-delete'),

    # Модерация
    path('moderation/pending/', PendingListingsView.as_view(), name='moderation-pending'),
    path('moderation/', ListingModerationView.as_view(), name='listing-moderation'),
    path('moderation/<int:pk>/approve/', ApproveListingView.as_view(), name='moderation-approve'),
    path('moderation/<int:pk>/reject/', RejectListingView.as_view(), name='moderation-reject'),

    # Продвижение
    path('<int:pk>/promote/', PromoteListingView.as_view(), name='listing-promote'),

    # Справочники (refs)
    path('refs/', include(router.urls)),

]