from rest_framework.generics import ListAPIView, RetrieveAPIView
from .serializers import CategorySerializer, ProductSerializer
from .models import Product, Category


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
