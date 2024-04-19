# Generated by Django 4.2.5 on 2024-04-19 12:26

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tgbot", "0002_remove_telegramclient_telegramcli_user_id_2f24c9_idx_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="telegramclient",
            name="username",
            field=models.CharField(
                default="default", max_length=32, verbose_name="Имя пользователя"
            ),
            preserve_default=False,
        ),
    ]
