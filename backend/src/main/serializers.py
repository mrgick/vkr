from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from shop.models import Cart


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid token found in cookie 'refresh_token'")


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
        print(password2, self.initial_data["password1"])
        password1 = self.initial_data["password1"]
        if password1 and password2 and password1 != password2:
            raise serializers.ValidationError("Введенные пароли не совпадают.")

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
