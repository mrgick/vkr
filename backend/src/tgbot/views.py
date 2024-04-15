import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class BoWebHooktView(APIView):
    def post(self, request, token):
        if token != settings.TELEGRAM_WEBHOOK_TOKEN:
            return Response(
                {"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )

        process_telegram_message(request.data)
        return Response({"success": True})


def process_telegram_message(message):
    name = message["message"]["from"]["first_name"]
    text = message["message"]["text"]
    chat_id = message["message"]["chat"]["id"]

    reply = f"Hi {name}! Got your message: {text}"

    reply_url = f"https://api.telegram.org/bot{settings.TELEGRAM_TOKEN}/sendMessage"

    data = {"chat_id": chat_id, "text": reply}

    requests.post(reply_url, data=data)
