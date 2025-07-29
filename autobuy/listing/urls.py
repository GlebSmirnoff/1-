from django.urls import path
from .views import (
    ListingListCreateView,
    ListingDetailView,
    ListingPhotoUploadView,
    ListingPhotoDeleteView,
    FavoriteListCreateView,
    FavoriteDeleteView,
    ListingModerationView,
    PendingListingsView,
    ApproveListingView,
    RejectListingView,
    PromoteListingView,
)

urlpatterns = [
    # Listings: list and create
    path('', ListingListCreateView.as_view(), name='listing-list-create'),
    # Listing detail, update, delete
    path('<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
    # Photo upload/delete
    path('<int:pk>/photos/upload/', ListingPhotoUploadView.as_view(), name='listing-photo-upload'),
    path('photos/<int:photo_id>/delete/', ListingPhotoDeleteView.as_view(), name='listing-photo-delete'),
    # Favorites: list/create and delete
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/<int:pk>/delete/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    # Moderation endpoints
    path('moderation/pending/', PendingListingsView.as_view(), name='moderation-pending'),
    path('moderation/', ListingModerationView.as_view(), name='listing-moderation'),
    path('moderation/<int:pk>/approve/', ApproveListingView.as_view(), name='moderation-approve'),
    path('moderation/<int:pk>/reject/', RejectListingView.as_view(), name='moderation-reject'),
    # Promote listing
    path('<int:pk>/promote/', PromoteListingView.as_view(), name='listing-promote'),
]
