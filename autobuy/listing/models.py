from django.db import models
from core.models import TimeStampedModel
from django.utils.text import slugify
from parler.models import TranslatableModel, TranslatedFields
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from wagtail.snippets.models import register_snippet
from parler.managers import TranslatableManager

User = get_user_model()

CURRENCY_CHOICES = [
    ("UAH", "грн"),
    ("USD", "долар"),
]

MODERATION_STATUSES = [
    ("draft", "Чернетка"),
    ("pending", "Очікує модерації"),
    ("approved", "Схвалено"),
    ("rejected", "Відхилено"),
]

PROMO_TYPES = [
    ("top", "Топ оголошення"),
    ("highlight", "Виділене"),
    ("vip", "VIP"),
]

class PromotedListingsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(
            is_promoted=True,
            promoted_until__gt=timezone.now()
        )

class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Model(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.brand.name} {self.name}"

class BodyType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Engine(models.Model):
    name = models.CharField(max_length=100)
    horsepower = models.PositiveIntegerField(null=True, blank=True)
    volume_l = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)

    def __str__(self):
        return self.name

class Transmission(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class FuelType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class DriveType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Color(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# 🔷 Основна модель оголошення
@register_snippet
class Listing(TranslatableModel, TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    translations = TranslatedFields(
        title=models.CharField(max_length=255),
        description=models.TextField(blank=True),
    )

    objects = TranslatableManager()
    promoted = PromotedListingsManager()

    @property
    def is_promoted_active(self):
        return self.promoted_until and self.promoted_until > timezone.now()

    vin = models.CharField(max_length=17, blank=True, null=True)
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True)
    owners_count = models.PositiveSmallIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="USD")

    is_reserved = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)

    year = models.PositiveSmallIntegerField()
    mileage = models.PositiveIntegerField(help_text="в км")

    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    model = models.ForeignKey(Model, on_delete=models.SET_NULL, null=True)
    body_type = models.ForeignKey(BodyType, on_delete=models.SET_NULL, null=True)
    engine = models.ForeignKey(Engine, on_delete=models.SET_NULL, null=True)
    transmission = models.ForeignKey(Transmission, on_delete=models.SET_NULL, null=True)
    fuel_type = models.ForeignKey(FuelType, on_delete=models.SET_NULL, null=True)
    drive_type = models.ForeignKey(DriveType, on_delete=models.SET_NULL, null=True)

    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUSES, default="pending")
    moderation_reason = models.TextField(blank=True, null=True)

    is_promoted = models.BooleanField(default=False)
    promoted_until = models.DateTimeField(null=True, blank=True)
    promoted_type = models.CharField(max_length=20, choices=PROMO_TYPES, null=True, blank=True)

    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.safe_translation_getter('title', any_language=True) or str(self.pk))
            slug = base_slug
            num = 1
            while Listing.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.safe_translation_getter('title', any_language=True) or f"Listing #{self.id}"

class ListingPhoto(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="listing_photos/")
    is_main = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"Photo #{self.id} for Listing #{self.listing_id}"

    class Meta:
        ordering = ["order"]

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="favorited_by")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "listing")
        ordering = ["-added_at"]

    def __str__(self):
        return f"{self.user.email} → {self.listing}"

