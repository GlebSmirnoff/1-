# autobuy/listing/admin.py

from django.contrib import admin
from parler.admin import TranslatableAdmin
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

from .models import (
    Listing, Brand, Model, BodyType, Engine,
    Transmission, FuelType, DriveType, Color, ListingPhoto
)

User = get_user_model()

# 🧑‍💼 Пользователи
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("id", "email", "is_active", "is_staff", "is_superuser")
    search_fields = ("email",)
    ordering = ("-date_joined",)
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Додатково", {"fields": ("account_type",)}),
    )


# 📸 Inline для фотографий
class ListingPhotoInline(admin.TabularInline):
    model = ListingPhoto
    extra = 1
    fields = ("image", "is_main", "order", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" />', obj.image.url)
        return "-"
    preview.short_description = "Preview"


# 📦 Оголошення с inline‑фото
@admin.register(Listing)
class ListingAdmin(TranslatableAdmin):
    inlines = [ListingPhotoInline]

    list_display = (
        "id", "user", "vin", "price", "currency", "moderation_status",
        "is_sold", "is_reserved", "created_at"
    )
    list_editable = ("moderation_status",)
    list_filter = (
        "moderation_status", "is_sold", "currency",
        "brand", "model", "year"
    )
    search_fields = ("vin", "translations__title", "user__email")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    readonly_fields = ("slug",)

    fieldsets = (
        (None, {
            "fields": (
                "user", "vin", "brand", "model", "year",
                "price", "currency", "is_reserved", "is_sold",
                "moderation_status", "moderation_reason", "slug"
            )
        }),
        ("Інше", {
            "fields": (
                "color", "mileage", "owners_count",
                "description", "is_promoted", "promoted_type", "promoted_until"
            ),
            "classes": ("collapse",)
        }),
    )


# 📘 Довідники
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Model)
class ModelAdmin(admin.ModelAdmin):
    list_display = ("id", "brand", "name")
    list_filter = ("brand",)
    search_fields = ("name",)


admin.site.register(BodyType)
admin.site.register(Engine)
admin.site.register(Transmission)
admin.site.register(FuelType)
admin.site.register(DriveType)
admin.site.register(Color)
