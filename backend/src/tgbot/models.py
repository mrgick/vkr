from django.contrib.auth.models import User
from django.db import models


class TelegramClient(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Пользователь сайта", db_index=True
    )
    chat_id = models.PositiveIntegerField(
        db_index=True, verbose_name="Ид телеграм чата"
    )
    username = models.CharField(max_length=32, verbose_name="Имя пользователя")

    class Meta:
        db_table = "TelegramClient"
        verbose_name = "телеграм пользователь"
        verbose_name_plural = "телеграм пользователи"
        indexes = [
            models.Index(fields=["user", "chat_id"]),
        ]
