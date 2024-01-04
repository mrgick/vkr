from rest_framework.views import APIView
from rest_framework.response import Response


class HomeView(APIView):
    def get(request, *args, **kwargs):
        return Response({"status": "good"})
