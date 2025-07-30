from rest_framework import serializers
from .models import Listing, ListingPhoto, Favorite, PROMO_TYPES, Brand, Model as CarModel, BodyType, Engine, Transmission, FuelType, DriveType, Color


class ListingPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingPhoto
        fields = ["id", "image", "is_main", "order"]


class ListingSerializer(serializers.ModelSerializer):
    title = serializers.CharField(write_only=True)
    description = serializers.CharField(write_only=True, allow_blank=True)
    photos = ListingPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'user', 'title', 'description', 'vin', 'color',
            'owners_count', 'price', 'currency', 'is_reserved', 'is_sold',
            'year', 'mileage', 'brand', 'model', 'body_type', 'engine',
            'photos', 'slug', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Extract translatable fields
        title = validated_data.pop('title')
        description = validated_data.pop('description')
        # Create instance without translations
        listing = Listing.objects.create(**validated_data)
        # Save translations
        lang = self.context.get('request').LANGUAGE_CODE if self.context.get('request') else 'uk'
        listing.set_current_language(lang)
        listing.title = title
        listing.description = description
        listing.save()
        return listing

    def update(self, instance, validated_data):
        title = validated_data.pop('title', None)
        description = validated_data.pop('description', None)
        # Update non-translatable fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # Update translations
        lang = self.context.get('request').LANGUAGE_CODE if self.context.get('request') else 'uk'
        instance.set_current_language(lang)
        if title is not None:
            instance.title = title
        if description is not None:
            instance.description = description
        instance.save()
        return instance


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "listing", "added_at"]


class PromoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ["promoted_type", "promoted_until"]

    def validate_promoted_type(self, value):
        promo_types = [choice[0] for choice in PROMO_TYPES]
        if value not in promo_types:
            raise serializers.ValidationError("Недійсний тип промо.")
        return value
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = ['id', 'name', 'brand']

class BodyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyType
        fields = ['id', 'name']

class EngineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Engine
        fields = ['id', 'name', 'horsepower', 'volume_l']

class TransmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transmission
        fields = ['id', 'name']

class FuelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelType
        fields = ['id', 'name']

class DriveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveType
        fields = ['id', 'name']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name']