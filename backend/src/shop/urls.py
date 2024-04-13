from django.urls import path

from . import views

urlpatterns = [
    path("categories/", views.ListCategories.as_view(), name="list_categories"),
    path(
        "products/<int:category>/", views.ListProducts.as_view(), name="list_products"
    ),
    path("products/", views.ListProducts.as_view(), name="list_products"),
    path("product/<int:pk>/", views.ItemProduct.as_view(), name="item_product"),
    path("cart-item/<int:product_id>/", views.ChangeCart.as_view(), name="cart_item"),
    path("cart/", views.CartRead.as_view(), name="cart"),
    path("cart-products/", views.CartProducts.as_view(), name="cart_products"),
    path("orders/", views.OrdersView.as_view(), name="orders"),
    path("review/", views.ReviewCreateView.as_view(), name="review_create"),
    path(
        "review/<int:product_id>/",
        views.ReviewUpdateDestroyView.as_view(),
        name="review_update_destroy",
    ),
    path(
        "reviews/<int:product_id>/",
        views.ReviewListView.as_view(),
        name="review_list",
    ),
]
