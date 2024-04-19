from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.filters import SearchFilter
from rest_framework.generics import (
    CreateAPIView,
    GenericAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication

from main.redis import delete_cache
from main.serializers import Pagination
from tgbot.bot import tg_send_order

from .models import Cart, CartItem, Category, Order, OrderItem, Product, Review
from .serializers import (
    CartItemChangeSerializer,
    CartProductsSerializer,
    CartSerializer,
    CategorySerializer,
    OrderSerializer,
    ProductSerializer,
    ReviewCreateSerializer,
    ReviewReadSerializer,
    ReviewUpdateSerializer,
)


class ListCategories(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    CACHE_KEY_PREFIX = "categories"

    @method_decorator(cache_page(60 * 60 * 2, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ListProducts(ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter]
    search_fields = ["id", "title"]
    CACHE_KEY_PREFIX = "products"

    def get_queryset(self):
        category = self.kwargs.get("category")
        queryset = Product.objects.filter(stock=True)
        if category:
            queryset = queryset.filter(category=category)
        return queryset.all()

    @method_decorator(cache_page(60 * 60 * 2, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ItemProduct(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    CACHE_KEY_PREFIX = "products"

    @method_decorator(cache_page(60 * 60 * 2, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


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
    serializer_class = CartProductsSerializer

    def get(self, request):
        cart = Cart.objects.filter(client=self.request.user.id).first()
        return Response(
            [x.product.id for x in CartItem.objects.filter(cart=cart).all()]
        )


class OrdersView(ListAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    pagination_class = Pagination

    def get_queryset(self):
        return Order.objects.filter(client=self.request.user.id).all()

    def post(self, request):
        cart = Cart.objects.filter(client=request.user.id).first()
        if cart.count == 0:
            return Response(status=400, data={"detail": "Cart is empty"})
        order = Order(
            client_id=request.user.id, status=0, count=cart.count, total=cart.total
        )
        order.save()
        order_items = []
        for cart_item in CartItem.objects.filter(cart=cart):
            order_item = OrderItem(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                total=cart_item.total,
            )
            order_item.calculate()
            order_items.append(order_item)
            cart_item.delete()
        order.calculate()
        cart.save()

        tg_send_order(request.user.id, order, order_items)
        return Response(data={"detail": "success"}, status=201)


class ReviewListView(ListAPIView):
    serializer_class = ReviewReadSerializer
    pagination_class = Pagination
    CACHE_KEY_PREFIX = "reviews"

    def get_queryset(self):
        return Review.objects.filter(product=self.kwargs["product_id"]).all()

    @method_decorator(cache_page(60 * 60 * 2, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ReviewCreateView(CreateAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewCreateSerializer
    CACHE_KEY_PREFIX = "reviews"

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        delete_cache(self.CACHE_KEY_PREFIX)
        return response


class ReviewView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTStatelessUserAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewUpdateSerializer
    CACHE_KEY_PREFIX = "reviews"

    def get_object(self):
        return Review.objects.filter(
            author=self.request.user.id, product=self.kwargs["product_id"]
        ).first()

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        delete_cache(self.CACHE_KEY_PREFIX)
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        delete_cache(self.CACHE_KEY_PREFIX)
        return response

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        delete_cache(self.CACHE_KEY_PREFIX)
        return response
