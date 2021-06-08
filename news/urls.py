from django.urls import path, include
from . import views


app_name = 'news'

urlpatterns = [
    path('', views.index, name='index'),
    path('posts/', views.posts, name='posts'),
    path('coins/', views.coins, name='coins'),
    path('coins/<int:coin_id>', views.coinpage, name='coinpage'),
    path('search', views.search, name='search'),
]
