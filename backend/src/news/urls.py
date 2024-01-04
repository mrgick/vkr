from django.urls import path

from . import views

urlpatterns = [
    path("last/", views.LastNews.as_view(), name='last_news'),
    path("", views.ListNews.as_view(), name="list_news"),
    path("<int:pk>/", views.ItemNews.as_view(), name="item_news")
]
