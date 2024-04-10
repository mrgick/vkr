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
    path("user/", views.UserInfoView.as_view(), name="user_info"),
    path("news/", views.NewsListView.as_view(), name="crm_news_list"),
    path("news/<int:pk>/", views.NewsItemView.as_view(), name="crm_news_item"),
    path("categories/", views.CategoriesListView.as_view(), name="crm_category_list"),
    path(
        "category/<int:pk>/", views.CategoryItemView.as_view(), name="crm_category_item"
    ),
    path("products/", views.ProductListView.as_view(), name="crm_product_list"),
    path("product/<int:pk>/", views.ProductItemView.as_view(), name="crm_product_item"),
]
