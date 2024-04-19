from typing import Any, Dict

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import AccessToken

from shop.models import Order, Product
from shop.serializers import OrderSerializer


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ("password",)


class CRMProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class OrderUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


class OrderListSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source="get_status_display")
    client = OrderUserSerializer()

    class Meta:
        model = Order
        fields = "__all__"


class OrderItemSerializer(OrderSerializer):
    client = OrderUserSerializer()


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ("id", "status")
