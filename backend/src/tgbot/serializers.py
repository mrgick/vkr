from rest_framework import serializers

from .models import TelegramClient


class TelegramClientSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return super().create(
            {"user_id": self.context["request"].user.id, **validated_data}
        )

    class Meta:
        model = TelegramClient
        fields = "__all__"
        read_only_fields = ("user",)
