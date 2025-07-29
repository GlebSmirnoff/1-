from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from .models import PhoneVerificationCode, PasswordResetCode

User = get_user_model()

# Спершу відреєструємо, якщо вже зареєстровано
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ("email", "full_name", "account_type", "is_staff", "is_active", "created_at")
    list_filter = ("account_type", "is_staff", "is_active", "is_superuser", "groups")

    search_fields = ("email", "full_name", "phone")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Персональні дані"), {"fields": ("full_name", "phone", "account_type")}),
        (_("Права доступу"), {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            ),
        }),
        (_("Інше"), {"fields": ("last_login", "created_at")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "password1", "password2", "account_type", "is_active", "is_staff", "is_superuser"),
        }),
    )


@admin.register(PhoneVerificationCode)
class PhoneVerificationCodeAdmin(admin.ModelAdmin):
    list_display = ("phone", "code", "created_at")
    readonly_fields = ("created_at",)


@admin.register(PasswordResetCode)
class PasswordResetCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "phone", "code", "created_at", "via_sms")
    readonly_fields = ("created_at",)
