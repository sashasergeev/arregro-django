from django.shortcuts import render, redirect
from .models import Coin, Post
from django.core.paginator import Paginator


def search(request):
    if request.method == 'GET':
        search = request.GET.get('search')
        coins = Coin.objects.all().filter(name=search)
        context = {'coins': coins}
        return render(request, 'news/search_result.html', context)


# Create your views here.


def index(request):
    cards = list(Post.objects.order_by('-date_added'))
    context = {'cards': cards[:3]}
    return render(request, 'news/index.html', context)


def coins(request):
    coins = Coin.objects.all()

    coin_paginator = Paginator(coins, 18)
    page_num = request.GET.get('page')
    page = coin_paginator.get_page(page_num)

    context = {'coins': coins,
               'page':page
               }
    return render(request, 'news/coins.html', context)


def posts(request):
    cards = Post.objects.order_by('-date_added')
    coins = list(Coin.objects.all())

    card_paginator = Paginator(cards, 9)
    page_num = request.GET.get('page')
    page = card_paginator.get_page(page_num)
    context = {'cards': cards,
               'coins': coins,
               'page': page,
               }
    return render(request, 'news/posts.html', context)


def coinpage(request, coin_id):
    coin = Coin.objects.get(id=coin_id)
    posts = coin.posts.order_by('-date_added')
    context = {
        'coin': coin,
        'posts': posts,
    }
    return render(request, 'news/coin.html', context)
