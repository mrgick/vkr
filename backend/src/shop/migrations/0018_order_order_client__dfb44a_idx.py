# Generated by Django 4.2.5 on 2024-01-18 12:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shop", "0017_remove_order_items_alter_orderitem_quantity_and_more"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="order",
            index=models.Index(fields=["client"], name="Order_client__dfb44a_idx"),
        ),
    ]