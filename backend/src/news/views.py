from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import News
from .serializers import NewsSerializer

CACHE_KEY_PREFIX = "news"


class LastNews(ListAPIView):
    queryset = News.objects.all()[:3]
    serializer_class = NewsSerializer

    @method_decorator(cache_page(60 * 60 * 2, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ListNews(ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    @method_decorator(cache_page(60 * 60 * 2, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ItemNews(RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    @method_decorator(cache_page(60 * 60 * 2, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
