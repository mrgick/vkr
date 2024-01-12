from rest_framework import serializers

from .models import Cart, CartItem, Category, Product


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
        fields = ("product", "quantity")
        extra_kwargs = {"product": {"required": True}, "quantity": {"required": True}}


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
