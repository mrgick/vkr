from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from . import views

schema_view = get_schema_view(
    openapi.Info(
        title="Dice Harmony API",
        default_version="v1",
        description="Dice Harmony API",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path("", views.HomeView.as_view(), name="home"),
    path("is-auth/", views.IsAuth.as_view(), name="is_auth"),
    path("token/", views.CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path(
        "token/refresh/", views.CookieTokenRefreshView.as_view(), name="token_refresh"
    ),
    path("token/delete/", views.Logout.as_view(), name="token_delete"),
    path("registration/", views.Registration.as_view(), name="registration"),
    path(
        "registration-confirmation/",
        views.RegistrationConfirmation.as_view(),
        name="registration_confirmation",
    ),
    path("reset-password/", views.ResetPassword.as_view(), name="reset_password"),
    path(
        "reset-password-confirmation/",
        views.ResetPasswordConfirmation.as_view(),
        name="reset_password_confirmation",
    ),
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change_password"
    ),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path(
        "swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]
