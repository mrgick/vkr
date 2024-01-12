from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication

from .models import Cart, CartItem, Category, Product
from .serializers import (
    CartItemChangeSerializer,
    CartItemSerializer,
    CartSerializer,
    CategorySerializer,
    ProductSerializer,
)


class ListCategories(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ListProducts(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category = self.kwargs.get("category")
        if category:
            return Product.objects.filter(category=category).all()
        return Product.objects.all()


class ItemProduct(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ChangeCart(GenericAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemChangeSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = Cart.objects.filter(client=self.request.user.id).first()
        instance = CartItem.objects.filter(
            cart=cart, product=serializer.validated_data["product"]
        ).first()
        if serializer.validated_data["quantity"] == 0:
            if instance is not None:
                instance.delete()
            return Response({"detail": "success"})
        serializer = CartItemSerializer(
            instance, data={"cart": cart.id, **request.data}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "success"})


class CartRead(RetrieveAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        return Cart.objects.filter(client=self.request.user.id).first()
