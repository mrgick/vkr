from datetime import timedelta

from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import Token

from shop.models import Cart
from tgbot.models import TelegramClient


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid token found in cookie 'refresh_token'")


class TokenConfirmation(Token):
    lifetime = timedelta(days=1)
    token_type = "access"


class TokenConfirmationSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=10000, allow_blank=False, allow_null=False)

    def validate_token(self, value):
        try:
            return TokenConfirmation(token=value).payload["data"]
        except Exception:
            raise serializers.ValidationError("Токен не валиден.")  # noqa: B904


class RegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(
        max_length=128, allow_blank=False, allow_null=False
    )
    password2 = serializers.CharField(
        max_length=128, allow_blank=False, allow_null=False
    )
    first_name = serializers.CharField(
        max_length=150, allow_blank=False, allow_null=False
    )
    last_name = serializers.CharField(
        max_length=150, allow_blank=False, allow_null=False
    )
    email = serializers.EmailField(max_length=320, allow_blank=False, allow_null=False)

    def validate_password2(self, password2):
        password1 = self.initial_data["password1"]
        if password1 and password2 and password1 != password2:
            raise serializers.ValidationError("Введенные пароли не совпадают.")
        return password2

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "Пользователь с данным email уже зарегистрирован."
            )
        return email

    def validate(self, data):
        errors = {}
        try:
            password_validation.validate_password(data["password1"])
        except ValidationError as e:
            for i, x in enumerate(e.messages):
                errors[f"password-{i}"] = x

        if errors:
            raise serializers.ValidationError(errors)
        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        user.set_password(validated_data["password2"])
        user.save()
        cart = Cart(client=user)
        cart.save()
        return user

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password1",
            "password2",
        )
        read_only_fields = ("id",)


class ResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email",)


class ResetPasswordConfirmationSerializer(serializers.Serializer):
    password1 = serializers.CharField(
        max_length=128, allow_blank=False, allow_null=False
    )
    password2 = serializers.CharField(
        max_length=128, allow_blank=False, allow_null=False
    )
    id = serializers.IntegerField()
    token = serializers.CharField(max_length=320, allow_blank=False, allow_null=False)

    def validate(self, data):
        errors = {}
        try:
            password_validation.validate_password(data["password1"])
        except ValidationError as e:
            for i, x in enumerate(e.messages):
                errors[f"password-{i}"] = x

        if errors:
            raise serializers.ValidationError(errors)
        return data

    def validate_password2(self, password2):
        password1 = self.initial_data["password1"]
        if password1 and password2 and password1 != password2:
            raise serializers.ValidationError("Введенные пароли не совпадают.")
        return password2


class ProfileSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        tg = TelegramClient.objects.filter(user_id=data["id"]).first()
        if tg is not None:
            data["tg_username"] = tg.username
        return data

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")
        read_only_fields = ("id", "username")


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128, required=True)
    password1 = serializers.CharField(max_length=128, required=True)
    password2 = serializers.CharField(max_length=128, required=True)

    def validate_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Текущий пароль введён неверно.")
        return value

    def validate(self, data):
        errors = {}
        try:
            password_validation.validate_password(
                data["password1"], self.context["request"].user
            )
        except ValidationError as e:
            for i, x in enumerate(e.messages):
                errors[f"password-{i}"] = x

        if errors:
            raise serializers.ValidationError(errors)
        return data

    def validate_password2(self, password2):
        password1 = self.initial_data["password1"]
        if password1 and password2 and password1 != password2:
            raise serializers.ValidationError("Введенные новые пароли не совпадают.")
        return password2


class Pagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 10000

    def get_paginated_response(self, data):
        return Response(
            {
                "current_page": self.page.number,
                "max_page": self.page.paginator.num_pages,
                "data": data,
            }
        )
