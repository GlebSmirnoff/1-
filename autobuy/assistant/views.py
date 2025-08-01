from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

"""assistant/views.py — refactored version with serializer, service layer and viewset
   Depends: djangorestframework, project apps `assistant`, `listing`
"""
from rest_framework import serializers, status, viewsets, mixins
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from .services import generate_listing_suggestions

class ListingDraftSerializer(serializers.Serializer):
    brand = serializers.CharField(max_length=64)
    model = serializers.CharField(max_length=64)
    year = serializers.IntegerField(min_value=1980, max_value=2050)
    engine = serializers.CharField(max_length=32)
    mileage = serializers.IntegerField(required=False, min_value=0)
    description_user = serializers.CharField(required=False, allow_blank=True, max_length=2000)

    def validate(self, attrs):
        # Simple sanity‑check: year should not be in the future
        from datetime import datetime
        if attrs["year"] > datetime.now().year:
            raise serializers.ValidationError({"year": "Year cannot be in the future"})
        return attrs

class ListingTipsViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Return AI suggestions for a draft listing.
    create() => POST /ai/assistant/listing/tips/
    """

    serializer_class = ListingDraftSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        draft_data = serializer.validated_data

        suggestions = generate_listing_suggestions(draft_data)
        return Response(suggestions, status=status.HTTP_200_OK)

    # Optional: expose an endpoint to preview generated description only
    @action(detail=False, methods=["POST"], url_path="description")
    def description(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        description = generate_listing_suggestions(serializer.validated_data)["description"]
        return Response({"description": description})
