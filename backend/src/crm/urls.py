from django.urls import path

from . import views

urlpatterns = [
    path(
        "token/",
        views.CookieTokenObtainPairView.as_view(),
        name="crm_token_obtain_pair",
    ),
    path(
        "token/refresh/",
        views.CookieTokenRefreshView.as_view(),
        name="crm_token_refresh",
    ),
    path("token/delete/", views.Logout.as_view(), name="crm_token_delete"),
    path("news/", views.NewsListView.as_view(), name="crm_news"),
]
