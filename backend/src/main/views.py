from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    CookieTokenRefreshSerializer,
    RegistrationSerializer,
    ResetPasswordConfirmationSerializer,
    ResetPasswordSerializer,
    TokenConfirmation,
    TokenConfirmationSerializer,
)


class HomeView(APIView):
    def get(self, request):
        return Response({"status": "good"})


class IsAuth(APIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"user": request.user.id})


class Logout(APIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resp = Response({"detail": "success"})
        resp.delete_cookie("refresh_token")
        return resp


class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds())
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds())
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieTokenRefreshSerializer


class Registration(GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = TokenConfirmation()
        token.payload.update({"data": serializer.validated_data})
        url = f"{settings.CONFIRM_REGISTRATION_URL}?&token={str(token)}"
        send_mail(
            "Подтверждение регистрации",
            f"Ссылка на подтверждение регистрации: {url}",
            settings.EMAIL_HOST_USER,
            [serializer.validated_data["email"]],
            fail_silently=False,
        )
        return Response({"status": "success"})


class RegistrationConfirmation(GenericAPIView):
    serializer_class = TokenConfirmationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = RegistrationSerializer(data=serializer.validated_data["token"])
        if not user.is_valid():
            return Response(
                {"status": "Токен не валиден."},
                status.HTTP_400_BAD_REQUEST,
            )
        user.save()
        return Response({"status": "success"})


class ResetPassword(GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data["email"])
        token = default_token_generator.make_token(user)
        url = f"{settings.RESET_PASSWORD_URL}?id={user.id}&token={token}"
        send_mail(
            "Восстановление пароля",
            f"Ссылка на изменение пароля: {url}",
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return Response({"status": "success"})


class ResetPasswordConfirmation(GenericAPIView):
    serializer_class = ResetPasswordConfirmationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(id=serializer.validated_data["id"]).first()
        if user is None or not default_token_generator.check_token(
            user, serializer.validated_data["token"]
        ):
            return Response(
                {"status": "Время ожидания смены пароля истекло"},
                status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(serializer.validated_data["password2"])
        user.save()
        return Response({"status": "success"})
