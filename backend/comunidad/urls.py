from django.urls import path
from .views import PublicacionListCreateView

urlpatterns = [
    path('feed/', PublicacionListCreateView.as_view(), name='feed-list-create'),
]