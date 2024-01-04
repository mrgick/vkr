from .models import News
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .serializers import NewsSerializer


class LastNews(ListAPIView):
    queryset = News.objects.all()[:3]
    serializer_class = NewsSerializer


class ListNews(ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer


class ItemNews(RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
