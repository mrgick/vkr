from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    RetrieveAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication

from .models import Cart, CartItem, Category, Product, Order, OrderItem
from .serializers import (
    CartItemChangeSerializer,
    OrderSerializer,
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
        queryset = Product.objects.filter(stock=True)
        if category:
            queryset = queryset.filter(category=category)
        return queryset.all()


class ItemProduct(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ChangeCart(GenericAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemChangeSerializer

    def post(self, request, product_id):
        product = Product.objects.filter(id=product_id).first()
        if product is None:
            return Response(status=404, data={"detail": "Product not found"})
        cart = Cart.objects.filter(client=self.request.user.id).first()
        instance = CartItem.objects.filter(cart=cart, product=product).first()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        if instance is None:
            serializer.save(cart=cart, product=product)
        else:
            serializer.save()
        return Response(serializer.data)

    def delete(self, request, product_id):
        cart = Cart.objects.filter(client=self.request.user.id).first()
        instance = CartItem.objects.filter(cart=cart, product=product_id).first()
        if instance:
            instance.delete()
        return Response({"detail": "success"})


class CartRead(RetrieveAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        return Cart.objects.filter(client=self.request.user.id).first()


class CartProducts(GenericAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = Cart.objects.filter(client=self.request.user.id).first()
        return Response(
            [x.product.id for x in CartItem.objects.filter(cart=cart).all()]
        )


class OrdersView(ListAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(client=self.request.user.id).all()

    def post(self, request):
        cart = Cart.objects.filter(client=request.user.id).first()
        if cart.count == 0:
            return Response(status=400, data={"detail": "Cart is empty"})
        order = Order(client_id=request.user.id, status=0, count=cart.count, total=cart.total)
        order.save()
        for cart_item in CartItem.objects.filter(cart=cart):
            order_item = OrderItem(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                total=cart_item.total,
            )
            order_item.calculate()
            cart_item.delete()
        order.calculate()
        cart.save()
        return Response(data={"detail": "success"}, status=201)
