from django.db import migrations

def copy_model_to_carmodel(apps, schema_editor):
    OldModel = apps.get_model('listing', 'Model')
    CarModel = apps.get_model('listing', 'CarModel')
    for old in OldModel.objects.all():
        CarModel.objects.create(
            id=old.id,
            brand_id=old.brand_id,
            name=old.name
        )

class Migration(migrations.Migration):
    dependencies = [
        ('listing', '0005_alter_listing_brand_carmodel_alter_listing_model_and_more'),  # попередня міграція
    ]
    operations = [
        migrations.RunPython(copy_model_to_carmodel),
    ]
