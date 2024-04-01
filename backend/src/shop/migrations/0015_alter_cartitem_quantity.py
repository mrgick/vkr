# Generated by Django 4.2.5 on 2024-01-13 15:14

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shop", "0014_remove_cart_items_alter_cartitem_unique_together"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cartitem",
            name="quantity",
            field=models.PositiveIntegerField(
                default=1,
                validators=[django.core.validators.MinValueValidator(1)],
                verbose_name="Количество",
            ),
        ),
    ]