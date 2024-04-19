from django.urls import path

from . import views

urlpatterns = [
    path(
        "webhook/<str:token>/", views.BoWebHooktView.as_view(), name="telegram_webhook"
    ),
    path("connect/", views.ConnectTelegram.as_view(), name="connect_telegram"),
]
