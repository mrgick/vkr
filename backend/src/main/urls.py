from django.urls import path

from . import views

urlpatterns = [
    path("", views.HomeView.as_view(), name="home"),
    path("is-auth/", views.IsAuth.as_view(), name="is_auth"),
    path("token/", views.CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path(
        "token/refresh/", views.CookieTokenRefreshView.as_view(), name="token_refresh"
    ),
    path("token/delete/", views.Logout.as_view(), name="token_delete"),
]
