from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import telebot

bot = telebot.TeleBot(settings.TELEGRAM_TOKEN)


class BoWebHooktView(APIView):
    def post(self, request, token):
        if token != settings.TELEGRAM_WEBHOOK_TOKEN:
            return Response(
                {"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )
        print(request.data)
        update = telebot.types.Update.de_json(request.data)
        bot.process_new_updates([update])
        return Response({"success": True})


@bot.message_handler(commands=["start"])
def greet(m):
    bot.send_message(m.chat.id, "Hello")
