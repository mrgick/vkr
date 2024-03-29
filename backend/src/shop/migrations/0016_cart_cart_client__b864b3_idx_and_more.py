# Generated by Django 4.2.5 on 2024-01-13 15:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shop", "0015_alter_cartitem_quantity"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="cart",
            index=models.Index(fields=["client"], name="Cart_client__b864b3_idx"),
        ),
        migrations.AddIndex(
            model_name="cartitem",
            index=models.Index(
                fields=["cart", "product"], name="Cart_item_cart_id_a4707c_idx"
            ),
        ),
    ]
