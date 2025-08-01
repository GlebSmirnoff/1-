# Generated by Django 5.2.4 on 2025-07-28 15:25

from django.db import migrations

def forwards(apps, schema_editor):
    OldModel = apps.get_model('listing', 'Model')       # стара модель-таблиця
    CarModel = apps.get_model('listing', 'CarModel')    # нова модель-таблиця
    for old in OldModel.objects.all():
        CarModel.objects.create(
            id=old.id,
            brand_id=old.brand_id,
            name=old.name,
        )

class Migration(migrations.Migration):
    dependencies = [
        ('listing', '0006_auto_20250728_1816'),
    ]
    operations = [
        migrations.RunPython(forwards, reverse_code=migrations.RunPython.noop),
    ]