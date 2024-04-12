from django.contrib.auth.models import User
from rest_framework.filters import SearchFilter
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
    RetrieveUpdateDestroyAPIView,
    UpdateAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from news.models import News
from news.serializers import NewsSerializer
from shop.models import Category, Order, Product
from shop.serializers import CategorySerializer

from .permissions import IsAdminUser, IsStuffUser
from .serializers import (
    AdminTokenObtainPairSerializer,
    CookieAdminTokenRefreshSerializer,
    CRMPagination,
    OrderItemSerializer,
    OrderListSerializer,
    OrderUpdateSerializer,
    ProductSerializer,
    UserSerializer,
)


class UserInfoView(RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class Logout(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]

    def post(self, request):
        resp = Response({"detail": "success"})
        resp.delete_cookie("refresh_token")
        return resp


class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds())
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = AdminTokenObtainPairSerializer


class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            cookie_max_age = int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds())
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
            )
            del response.data["refresh"]
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieAdminTokenRefreshSerializer


class NewsListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pagination_class = CRMPagination
    filter_backends = [SearchFilter]
    search_fields = ["id", "title"]


class NewsItemView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    serializer_class = NewsSerializer
    queryset = News.objects.all()


class CategoriesListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = CRMPagination
    filter_backends = [SearchFilter]
    search_fields = ["id", "title"]


class CategoryItemView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ProductListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = CRMPagination
    filter_backends = [SearchFilter]
    search_fields = ["id", "title"]


class ProductItemView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()


class UserListView(ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = CRMPagination
    filter_backends = [SearchFilter]
    search_fields = ["id", "username", "email", "first_name", "last_name"]


class UserItemView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all()


class OrderListView(ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    queryset = Order.objects.all()
    serializer_class = OrderListSerializer
    pagination_class = CRMPagination
    filter_backends = [SearchFilter]
    search_fields = ["id", "status", "client__username"]


class OrderItemView(RetrieveDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    serializer_class = OrderItemSerializer
    queryset = Order.objects.all()


class OrderUpdateView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStuffUser]
    serializer_class = OrderUpdateSerializer
    queryset = Order.objects.all()
