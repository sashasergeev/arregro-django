from django.urls import path, include
from . import views


app_name = 'news'

urlpatterns = [
    path('', views.index, name='index'),
    path('posts/', views.posts, name='posts'),

    path('coins/', views.coins, name='coins'),
    path('feed/', views.feed, name='feed'),
    path('coins/<int:coin_id>', views.coinpage, name='coinpage'),
    path('coins/search/', views.search, name='search'),
    path('new_coin/', views.new_coin, name='new_coin'),
]
