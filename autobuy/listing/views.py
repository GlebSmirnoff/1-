from rest_framework import generics, permissions, status, viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from django.shortcuts import get_object_or_404

from .models import Listing, ListingPhoto, Favorite
from .serializers import ListingSerializer, ListingPhotoSerializer, FavoriteSerializer, PromoteSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ListingFilter
from .permissions import IsModerator
from django.utils import timezone


# 🔐 Пермішн: дозволено тільки власнику редагувати або видаляти
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # GET, HEAD, OPTIONS — дозволено всім
        if request.method in permissions.SAFE_METHODS:
            return True
        # PUT, PATCH, DELETE — тільки власнику
        return obj.user == request.user


# ✅ CRUD для Listing
class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]  # GET — всім, POST — тільки з токеном

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsOwnerOrReadOnly]  # 👈 замінили на кастомний

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


# ✅ Upload фото
class ListingPhotoUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, listing_id):
        try:
            listing = Listing.objects.get(id=listing_id, user=request.user)
        except Listing.DoesNotExist:
            return Response({"error": "Оголошення не знайдено."}, status=404)

        if listing.photos.count() >= 20:
            return Response({"error": "Досягнуто ліміт в 20 фото."}, status=400)

        image = request.data.get("image")
        if not image:
            return Response({"error": "Файл зображення обов’язковий."}, status=400)

        photo = ListingPhoto.objects.create(listing=listing, image=image)
        serializer = ListingPhotoSerializer(photo)
        return Response(serializer.data, status=201)


# ✅ Delete фото
class ListingPhotoDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, photo_id):
        try:
            photo = ListingPhoto.objects.get(id=photo_id, listing__user=request.user)
        except ListingPhoto.DoesNotExist:
            return Response({"error": "Фото не знайдено або не ваше."}, status=404)

        photo.delete()
        return Response(status=204)

class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ListingFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ListingModerationView(APIView):
    permission_classes = [IsModerator]

    def get(self, request):
        listings = Listing.objects.filter(moderation_status="pending")
        serializer = ListingSerializer(listings, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request, pk):
        listing = Listing.objects.filter(pk=pk).first()
        if not listing:
            return Response({"error": "Оголошення не знайдено"}, status=status.HTTP_404_NOT_FOUND)

        status_value = request.data.get("moderation_status")
        reason = request.data.get("moderation_reason", "")

        if status_value not in ["approved", "rejected"]:
            return Response({"error": "Некоректний статус"}, status=status.HTTP_400_BAD_REQUEST)

        listing.moderation_status = status_value
        listing.moderation_reason = reason
        listing.save()

        return Response({"success": f"Статус оновлено на '{status_value}'"})

class ModerationViewSet(viewsets.ViewSet):
    permission_classes = [IsModerator]

    def list(self, request):
        listings = Listing.objects.filter(moderation_status="pending")
        serializer = ListingSerializer(listings, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        listing = Listing.objects.get(pk=pk)
        listing.moderation_status = "approved"
        listing.moderation_reason = ""
        listing.save()
        return Response({"status": "approved"})

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        reason = request.data.get("reason", "")
        if not reason:
            return Response({"error": "Причина обов’язкова"}, status=400)

        listing = Listing.objects.get(pk=pk)
        listing.moderation_status = "rejected"
        listing.moderation_reason = reason
        listing.save()
        return Response({"status": "rejected", "reason": reason})

class PendingListingsView(APIView):
    permission_classes = [IsModerator]

    def get(self, request):
        listings = Listing.objects.filter(moderation_status='pending')
        serializer = ListingSerializer(listings, many=True, context={"request": request})
        return Response(serializer.data)


class ApproveListingView(APIView):
    permission_classes = [IsModerator]

    def post(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk)
        listing.moderation_status = "approved"
        listing.moderation_reason = ""
        listing.save()
        return Response({"status": "approved"})


class RejectListingView(APIView):
    permission_classes = [IsModerator]

    def post(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk)
        reason = request.data.get("reason")
        if not reason:
            return Response({"error": "Потрібна причина відмови."}, status=400)
        listing.moderation_status = "rejected"
        listing.moderation_reason = reason
        listing.save()
        return Response({"status": "rejected", "reason": reason})

# 🔍 Список оголошень, що очікують модерації
class PendingListingsView(generics.ListAPIView):
    queryset = Listing.objects.filter(moderation_status="pending").order_by("-created_at")
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated, IsModerator]


# ✅ Схвалення оголошення
class ApproveListingView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsModerator]

    def post(self, request, pk):
        try:
            listing = Listing.objects.get(pk=pk)
            listing.moderation_status = "approved"
            listing.moderation_reason = ""
            listing.save()
            return Response({"status": "approved"})
        except Listing.DoesNotExist:
            return Response({"error": "Оголошення не знайдено"}, status=404)


# ❌ Відхилення оголошення
class RejectListingView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsModerator]

    def post(self, request, pk):
        reason = request.data.get("reason", "")
        if not reason:
            return Response({"error": "Причина обов'язкова"}, status=400)

        try:
            listing = Listing.objects.get(pk=pk)
            listing.moderation_status = "rejected"
            listing.moderation_reason = reason
            listing.save()
            return Response({"status": "rejected", "reason": reason})
        except Listing.DoesNotExist:
            return Response({"error": "Оголошення не знайдено"}, status=404)

class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

class PromoteListingView(generics.UpdateAPIView):
    queryset = Listing.objects.all()
    serializer_class = PromoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("У вас немає прав на це оголошення.")
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_promoted=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PromoteListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            listing = Listing.objects.get(pk=pk)
        except Listing.DoesNotExist:
            return Response({"detail": "Оголошення не знайдено."}, status=404)

        if request.user != listing.user and not request.user.is_staff:
            return Response({"detail": "У вас немає прав."}, status=403)

        promo_type = request.data.get("type")
        days = int(request.data.get("days", 1))

        if promo_type not in dict(Listing._meta.get_field("promoted_type").choices):
            return Response({"detail": "Невірний тип промо."}, status=400)

        listing.is_promoted = True
        listing.promoted_type = promo_type
        listing.promoted_until = timezone.now() + timezone.timedelta(days=days)
        listing.save()

        return Response({"detail": f"Оголошення просунуте на {days} днiв як '{promo_type}'"})