from django.conf import settings
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from telebot import types

from .bot import bot
from .serializers import TelegramClientSerializer


class ConnectTelegram(CreateAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TelegramClientSerializer


class BoWebHooktView(APIView):
    def post(self, request, token):
        if token != settings.TELEGRAM_WEBHOOK_TOKEN:
            return Response(
                {"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )
        print(request.data)
        update = types.Update.de_json(request.data)
        bot.process_new_updates([update])
        return Response({"success": True})
