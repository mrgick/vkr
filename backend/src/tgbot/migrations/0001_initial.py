# Generated by Django 4.2.5 on 2024-04-19 11:57

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="TelegramClient",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "client_id",
                    models.PositiveIntegerField(
                        verbose_name="Ид телеграм пользователя"
                    ),
                ),
                (
                    "chat_id",
                    models.PositiveIntegerField(
                        blank=True, db_index=True, verbose_name="Ид телеграм чата"
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Пользователь сайта",
                    ),
                ),
            ],
            options={
                "verbose_name": "телеграм пользователь",
                "verbose_name_plural": "телеграм пользователи",
                "db_table": "TelegramClient",
                "indexes": [
                    models.Index(
                        fields=["user", "client_id"],
                        name="TelegramCli_user_id_2f24c9_idx",
                    )
                ],
            },
        ),
    ]
