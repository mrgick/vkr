from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import telebot
from telebot import types
from telebot.util import quick_markup
from shop.models import Category, Product
from news.models import News
from django.db.models import Q

import json

bot = telebot.TeleBot(settings.TELEGRAM_TOKEN)


class BoWebHooktView(APIView):
    def post(self, request, token):
        if token != settings.TELEGRAM_WEBHOOK_TOKEN:
            return Response(
                {"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )
        update = types.Update.de_json(request.data)
        bot.process_new_updates([update])
        return Response({"success": True})


@bot.message_handler(commands=["start"])
def greet(message):
    bot.send_message(
        message.chat.id,
        "Привет! Я - бот Dice Harmony, ваш помощник в мире настольных игр. Я могу рассказать вам о наших новинках, помочь найти игру в нашем магазине. Чем я могу вам помочь?",
    )


@bot.message_handler(commands=["help"])
def help(message):
    bot.send_message(
        message.chat.id,
        "Список доступных команд:\n\n/help - справка\n\n/categories - список категорий\n/news - список новостей\n\n/site - адрес сайта\n/contacts - контакты\n\nКроме того, есть быстрый поиск по имени товара/новости",
    )


@bot.message_handler(commands=["site"])
def site(message):
    markup = quick_markup({"Открыть сайт": {"url": "https://dice-harmony.ru"}})
    bot.send_message(message.chat.id, "https://dice-harmony.ru", reply_markup=markup)


@bot.message_handler(commands=["contacts"])
def contacts(message):
    bot.send_message(
        message.chat.id,
        "Контакты:\n\nEmail - dice-harmony@yandex.ru\nТелефон - +7 (000) 000-0000\nРазработчик - [mrgick](https://github.com/mrgick)\nАдрес - улица Труда, 54, Псков, 180019\n",
        parse_mode="markdown",
    )
    bot.send_location(message.chat.id, 57.840474, 28.350750)


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


@bot.message_handler(commands=["news"])
def news(message):
    news = News.objects.all()[0]
    max_page = News.objects.count()
    markup = pagination(
        1,
        max_page,
        {"news": True},
        {"text": "Подробнее", "url": f"{settings.NEWS_LINK}/{news.id}"},
    )
    bot.send_message(
        message.chat.id,
        f"*{news.title}*\n\n{news.description}\n[\u200B]({news.image.url})",
        reply_markup=markup,
        parse_mode="markdown",
    )


@bot.callback_query_handler(func=lambda call: True)
def handle_button_click(call):
    res = None
    try:
        data = json.loads(call.data)
    except Exception:
        bot.send_message(call.message.chat.id, "Команда не распознана(")
        return
    if "hide" in data:
        bot.edit_message_reply_markup(
            call.message.chat.id,
            call.message.id,
        )
    elif "category" in data:
        category = data["category"]
        page = data.get("page", 1)
        product = Product.objects.filter(category=category, stock=True).all()[
            page - 1 : page
        ][0]
        max_page = Product.objects.filter(category=category, stock=True).count()
        markup = pagination(
            page,
            max_page,
            {"category": category},
            {"text": "Купить", "url": f"{settings.PRODUCT_LINK}/{product.id}"},
        )
        bot.edit_message_text(
            f"*★{str(product.rating)[:3]}  -  {product.title}  -  {product.price}₽*\n\n{product.description}\n[\u200B]({product.image.url})",
            call.message.chat.id,
            call.message.id,
            reply_markup=markup,
            parse_mode="markdown",
        )
    elif "news" in data:
        page = data.get("page", 1)
        news = News.objects.all()[page - 1 : page][0]
        max_page = News.objects.count()
        markup = pagination(
            page,
            max_page,
            {"news": True},
            {"text": "Подробнее", "url": f"{settings.NEWS_LINK}/{news.id}"},
        )
        bot.edit_message_text(
            f"{news.date.date()}  -  *{news.title}*\n\n{news.description}\n[\u200B]({news.image.url})",
            call.message.chat.id,
            call.message.id,
            reply_markup=markup,
            parse_mode="markdown",
        )
    else:
        bot.send_message(call.message.chat.id, "Команда не распознана(")


def pagination(page: int, max_page: int, data: dict, btn_url: dict = None):

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
    markup = types.InlineKeyboardMarkup()
    markup.row(*buttons)
    if btn_url:
        markup.row(types.InlineKeyboardButton(text=btn_url["text"], url=btn_url["url"]))
    markup.row(
        types.InlineKeyboardButton(
            text="Скрыть", callback_data=json.dumps({"hide": True, **data})
        )
    )

    return markup


@bot.message_handler(func=lambda message: True)
def echo_message(message):
    if len(Category.objects.filter(title__icontains=message.text)) > 0:
        categories(message)
    elif (
        product := Product.objects.filter(title__icontains=message.text).first()
    ) is not None:
        markup = types.InlineKeyboardMarkup()
        markup.row(
            types.InlineKeyboardButton(
                text="Подробнее", url=f"{settings.PRODUCT_LINK}/{product.id}"
            )
        )
        bot.send_message(
            message.chat.id,
            f"*★{str(product.rating)[:3]}  -  {product.title}  -  {product.price}₽*\n\n{product.description}\n[\u200B]({product.image.url})",
            reply_markup=markup,
            parse_mode="markdown",
        )
    elif (
        news := News.objects.filter(title__icontains=message.text).first()
    ) is not None:
        markup = types.InlineKeyboardMarkup()
        markup.row(
            types.InlineKeyboardButton(
                text="Подробнее", url=f"{settings.NEWS_LINK}/{news.id}"
            )
        )
        bot.send_message(
            message.chat.id,
            f"{news.date.date()}  -  *{news.title}*\n\n{news.description}\n[\u200B]({news.image.url})",
            reply_markup=markup,
            parse_mode="markdown",
        )
    else:
        bot.send_message(
            message.chat.id,
            "Поиск по сообщению ничего не дал(\nСписок доступных команд: /help",
        )
