import json

import telebot
from django.conf import settings
from django.core.mail import send_mail
from prettytable import PrettyTable
from telebot import types
from telebot.util import quick_markup

from news.models import News
from shop.models import Category, Order, OrderItem, Product

from .models import TelegramClient

bot = telebot.TeleBot(settings.TELEGRAM_TOKEN)


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
        "Список доступных команд:\n\n/help - справка\n\n/categories - список категорий\n/news - список новостей\n/orders - список моих заказов\n\n/site - адрес сайта\n/contacts - контакты\n\nКроме того, есть быстрый поиск по имени товара/новости",
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


@bot.message_handler(commands=["orders"])
def orders(message):
    user = get_auth_user(message.chat.id)
    if not user:
        return
    order = Order.objects.filter(client=user).first()
    if not order:
        bot.edit_message_text(
            "Список заказов пуст",
            message.chat.id,
            message.id,
            parse_mode="markdown",
        )
        return
    order_items = OrderItem.objects.filter(order=order).all()
    max_page = Order.objects.filter(client=user).count()
    markup = pagination(
        1,
        max_page,
        {"orders": True},
        {"text": "Подробнее", "url": "https://dice-harmony.ru/orders"},
    )
    bot.send_message(
        message.chat.id,
        f"Заказ *#{order.id}* от {order.date.date()}\nСтатус - {order.get_status_display()}\n\u200B\n```{order_to_table(order, order_items)}```",
        reply_markup=markup,
        parse_mode="markdown",
    )


@bot.callback_query_handler(func=lambda call: True)
def handle_button_click(call):
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
    elif "orders" in data:
        user = get_auth_user(call.message.chat.id)
        if not user:
            return
        page = data.get("page", 1)
        order = Order.objects.filter(client=user).all()[page - 1 : page][0]
        order_items = OrderItem.objects.filter(order=order).all()
        max_page = Order.objects.filter(client=user).count()
        markup = pagination(
            page,
            max_page,
            {"orders": True},
            {"text": "Подробнее", "url": "https://dice-harmony.ru/orders"},
        )
        bot.edit_message_text(
            f"Заказ *#{order.id}* от {order.date.date()}\nСтатус - {order.get_status_display()}\n\u200B\n```{order_to_table(order, order_items)}```",
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


def order_to_table(order: Order, order_items: list[OrderItem]) -> PrettyTable:
    table = PrettyTable()
    table.field_names = ["Товар", "Количество", "Стоимость"]
    for i, x in enumerate(order_items):
        row = [x.product.title, f"{x.quantity} шт.", f"{x.total}₽"]
        if i == len(order_items) - 1:
            table.add_row(row, divider=True)
        else:
            table.add_row(row)
    table.add_row(["Итого", f"{order.count} шт.", f"{order.total}₽"])
    return table


def get_auth_user(chat_id):
    user = TelegramClient.objects.filter(chat_id=chat_id).first()
    if user is None:
        bot.send_message(
            chat_id,
            "Вы не привязали аккаунт к сайту",
            reply_markup=quick_markup(
                {"Привязать?": "https://dice-harmony.ru/profile"}
            ),
        )
        return False
    return user.user


def tg_send_order(user_id, order: Order, order_items: list[OrderItem]):
    user = TelegramClient.objects.filter(user_id=user_id).first()
    if user is None:
        return
    markup = quick_markup(
        {"Мои заказы": {"callback_data": json.dumps({"orders": True, "page": 1})}}
    )
    table = order_to_table(order, order_items)
    bot.send_message(
        user.chat_id,
        f"Создан заказ *#{order.id}* от {order.date.date()}\nСтатус - {order.get_status_display()}\n\u200B\n```{table}```",
        parse_mode="markdown",
        reply_markup=markup,
    )
    message = f"<html><body><div>Создан заказ #{order.id} от {order.date.date()}</div><div>Статус - {order.get_status_display()}</div><br/>{table.get_html_string()}</body></html>"
    send_mail(
        f"Создан заказ #{order.id}",
        message,
        settings.EMAIL_HOST_USER,
        [user.user.email],
        html_message=message,
    )


def tg_send_update_order(order: Order):
    user = TelegramClient.objects.filter(user_id=order.client_id).first()
    if user is None:
        return
    markup = quick_markup(
        {"Мои заказы": {"callback_data": json.dumps({"orders": True, "page": 1})}}
    )
    bot.send_message(
        user.chat_id,
        f'Статус заказа *#{order.id}* изменился на "{order.get_status_display()}"',
        parse_mode="markdown",
        reply_markup=markup,
    )
    send_mail(
        f"Статус заказа #{order.id} изменился",
        f'Статус заказа #{order.id} изменился на "{order.get_status_display()}"',
        settings.EMAIL_HOST_USER,
        [user.user.email],
    )
