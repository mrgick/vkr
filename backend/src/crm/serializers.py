from typing import Any, Dict

from django.contrib.auth.models import User
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import AccessToken


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        data = super().validate(attrs)
        if not self.user.is_staff:
            raise InvalidToken("Not admin")
        return data


class CookieAdminTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        if attrs["refresh"]:
            data = super().validate(attrs)
            user_id = AccessToken(data["access"]).payload["user_id"]
            if not User.objects.filter(pk=user_id, is_staff=True).first():
                raise InvalidToken("Not admin")
            return data
        raise InvalidToken("No valid token found in cookie 'refresh_token'")