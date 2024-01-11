from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views
from .jwt import CookieTokenRefreshView, CookieTokenObtainPairView

urlpatterns = [
    path("", views.HomeView.as_view(), name="home"),
    path("is-auth/", views.IsAuth.as_view(), name="is_auth"),
    path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
]
