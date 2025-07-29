import django_filters
from .models import Listing

class ListingFilter(django_filters.FilterSet):
    brand = django_filters.NumberFilter(field_name='brand__id')
    model = django_filters.NumberFilter(field_name='model__id')
    body_type = django_filters.NumberFilter(field_name='body_type__id')
    engine = django_filters.NumberFilter(field_name='engine__id')

    year__gte = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year__lte = django_filters.NumberFilter(field_name='year', lookup_expr='lte')

    price__gte = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price__lte = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = Listing
        fields = []