from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import telebot
from telebot import types
from telebot.util import quick_markup
from shop.models import Category, Product

import json

bot = telebot.TeleBot(settings.TELEGRAM_TOKEN)


class BoWebHooktView(APIView):
    def post(self, request, token):
        if token != settings.TELEGRAM_WEBHOOK_TOKEN:
            return Response(
                {"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )
        # print(request.data)
        update = types.Update.de_json(request.data)
        bot.process_new_updates([update])
        return Response({"success": True})


@bot.message_handler(commands=["start"])
def greet(message):
    bot.send_message(
        message.chat.id,
        "Привет! Я - бот Dice Harmony, ваш помощник в мире настольных игр. Я могу рассказать вам о наших новинках, помочь найти игру в нашем магазине. Чем я могу вам помочь?",
    )


@bot.message_handler(commands=["categories"])
def categories(message):
    markup = types.InlineKeyboardMarkup(row_width=1)
    buttons = [
        types.InlineKeyboardButton(
            text=item.title,
            callback_data=json.dumps({"category": item.id, "page": 1}),
        )
        for item in Category.objects.all()
    ]
    markup.add(*buttons)
    bot.send_message(
        message.chat.id,
        "Список категорий:\n",
        reply_markup=markup,
    )


@bot.callback_query_handler(func=lambda call: True)
def handle_button_click(call):
    res = None
    try:
        data = json.loads(call.data)
    except Exception:
        bot.send_message(call.message.chat.id, "Команда не распознана(")
    else:
        if "hide" in data:
            res = bot.edit_message_reply_markup(
                call.message.chat.id,
                call.message.id,
            )
        elif "category" in data:
            category = data["category"]
            page = data.get("page", 1)
            product = Product.objects.filter(category=category, stock=True).all()[page - 1 : page][
                0
            ]
            max_page = Product.objects.filter(category=category, stock=True).count()
            markup = pagination(page, max_page, {"category": category})
            # print(product.image.url)
            res = bot.edit_message_text(
                f"*{product.title} ★{str(product.rating)[:3]} {product.price}₽*\n\n{product.description}\n[\u200B]({product.image.url})",
                call.message.chat.id,
                call.message.id,
                reply_markup=markup,
                parse_mode="markdown",
            )


def pagination(page: int, max_page: int, data: dict):

    buttons = []
    if page > 1:
        buttons.append(
            types.InlineKeyboardButton(
                text="<",
                callback_data=json.dumps({"page": page - 1, **data}),
            )
        )
    buttons.append(
        types.InlineKeyboardButton(
            text=f"{page}/{max_page}",
            callback_data=json.dumps({"page": page, **data}),
        )
    )
    if page < max_page:
        buttons.append(
            types.InlineKeyboardButton(
                text=">", callback_data=json.dumps({"page": page + 1, **data})
            )
        )
    buttons.append(
        types.InlineKeyboardButton(
            text="Скрыть", callback_data=json.dumps({"hide": True, **data})
        )
    )
    markup = types.InlineKeyboardMarkup(row_width=len(buttons) - 1)
    markup.add(*buttons)
    return markup


@bot.message_handler(func=lambda message: True)
def echo_message(message):
    print(2)
    bot.reply_to(message, message.text)
