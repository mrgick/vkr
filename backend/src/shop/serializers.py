from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Cart, CartItem, Category, Order, OrderItem, Product, Review


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CartItemChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ("quantity",)
        extra_kwargs = {"quantity": {"required": True}}


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = "__all__"


class ProductReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "title", "price")


class CartItemReadSerializer(CartItemSerializer):
    product = ProductReadSerializer()


class CartSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        cart_items = CartItem.objects.filter(cart=data["id"]).all()
        data["items"] = CartItemReadSerializer(
            cart_items, many=True, read_only=True
        ).data
        return data

    class Meta:
        model = Cart
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductReadSerializer()

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source="get_status_display")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        items = OrderItem.objects.filter(order=data["id"]).all()
        data["items"] = OrderItemSerializer(items, many=True, read_only=True).data
        return data

    class Meta:
        model = Order
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ReviewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


class ReviewReadSerializer(serializers.ModelSerializer):
    author = ReviewUserSerializer()

    class Meta:
        model = Review
        fields = "__all__"


class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("text", "rating")
