from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required

from django.forms.models import model_to_dict
from django.db.models import Count, F, FloatField, ExpressionWrapper, Avg

import requests
from datetime import datetime, timedelta

from .forms import CoinForm
from .models import Coin, Post, PriceDynamic, Tag
from .tests import query_debugger

# SEARCH FUNCTIONALITY - JS POWERED
def search(request):
    if request.is_ajax():
        res = None
        coin = request.POST.get("coin")
        qs = Coin.objects.filter(name__icontains=coin)
        if len(qs) > 0 and len(coin) > 0:
            data = []
            for pos in qs:
                item = {"pk": pos.pk, "name": pos.name, "img": pos.img_link}
                data.append(item)
            res = data
        else:
            res = "no coins found..."
        return JsonResponse({"data": res})
    return JsonResponse({})


# GET POSTS BY SELECTED TAG - JS POWERED
def get_tags(request):
    if request.is_ajax():
        data = []
        tag_id = request.POST.get("tag_id")
        tag = Tag.objects.get(id=tag_id)
        cards = (
            tag.post_set.select_related("coin", "coin__prices")
            .prefetch_related("tag")
            .order_by("-date_added")
        )
        for i in cards:
            card = {
                "before_price": i.price,
                "after_price": i.coin.prices.price,
                "name": i.coin.name,
                "img": i.coin.img_link,
                "text": i.fuckquestions()[:100],
                "cg_link": i.coin.cg_link,
                "tg_link": i.coin.tg_link,
                "time": i.whenpublished(),
                "tags": i.get_tags(),
                "post_id": i.id,
                "change": round(
                    (float(i.coin.prices.price) / float(i.price) - 1) * 100, 2
                ),
            }
            data.append(card)
        return JsonResponse({"data": data})


# GET DATA ABOUT SELECTED COIN - JS POWERED
def get_data_modal(request):
    if request.is_ajax():
        post_id = request.POST.get("post_id")
        post = Post.objects.select_related("coin").get(id=post_id)
        modal = {
            "before": post.price,
            "after": post.coin.prices.price,
            "1hr": post.price1hr,
            "2hr": post.price2hr,
            "name": post.coin.name,
            "img": post.coin.img_link,
            "text": post.fuckquestions(),
            "cg_link": post.coin.cg_link,
            "tg_link": post.coin.tg_link,
            "time": post.whenpublished(),
            "tags": post.get_tags(),
        }
        return JsonResponse({"modal": modal})


# Create your views here.


def index(request):
    cards = list(Post.objects.order_by("-date_added"))
    lastday = (
        Post.objects.filter(date_added__gte=datetime.now() - timedelta(days=1))
        .annotate(
            change=ExpressionWrapper(
                (F("coin__prices__price") / F("price") - 1) * 100,
                output_field=FloatField(),
            )
        )
        .aggregate(Avg("change"))
    )  # get last day data
    lastdayNum = Post.objects.filter(
        date_added__gte=datetime.now() - timedelta(days=1)
    ).count()
    context = {
        "cards": cards[:3],
        "lastdayNum": lastdayNum,
    }
    if isinstance(lastday["change__avg"], int):
        state = "fall" if lastday["change__avg"] < 0 else "raise"
        context["lastday"] = round(lastday["change__avg"], 2)
        context["change"] = state
    else:
        context["lastday"] = 0
    return render(request, "news/index.html", context)


def coins(request):
    coins = Coin.objects.all()
    coinNum = Coin.objects.count()

    # FOLLOWING COINS
    if request.method == "POST":
        follow = request.POST.get("c_id")
        coin = Coin.objects.get(id=follow)
        if request.POST.get("action"):
            request.user.coin_set.add(coin)
            return JsonResponse({"action": "followed"})
        else:
            request.user.coin_set.remove(coin)
            return JsonResponse({"action": "unfollowed"})

    coin_paginator = Paginator(coins, 18)
    page_num = request.GET.get("page")
    page = coin_paginator.get_page(page_num)

    context = {
        "page": page,
        "coinNum": coinNum,
    }
    if request.user.is_authenticated:
        context["follow"] = request.user.coin_set.all()
    return render(request, "news/coins.html", context)


def tags(request):
    tags = Tag.objects.annotate(tag_count=Count("post"))
    return render(request, "news/tags.html", {"tags": tags})


def posts(request):
    cards = (
        Post.objects.select_related("coin")
        .prefetch_related("tag")
        .order_by("-date_added")
    )
    card_paginator = Paginator(cards, 12)
    page_num = request.GET.get("page")
    page = card_paginator.get_page(page_num)
    prices = PriceDynamic.objects.select_related("coin").all()
    pcs = []
    for i in prices:
        data = model_to_dict(i)
        data["name"] = i.coin.name
        pcs.append(data)
    context = {
        "page": page,
        "pcs": pcs,
    }
    return render(request, "news/posts.html", context)


def coinpage(request, coin_id):
    coin = Coin.objects.prefetch_related("posts").get(id=coin_id)
    posts = coin.posts.order_by("-date_added")
    am_i_follow = request.user.coin_set.filter(name__in=[coin])
    follow = True if am_i_follow else False
    try:
        price = coin.prices.price
    except:
        price = "Wrong ID"
    context = {"coin": coin, "posts": posts, "price": price, "follow": follow}
    return render(request, "news/coin.html", context)


@login_required
def new_coin(request):
    if request.method != "POST":
        form = CoinForm()
    else:
        form = CoinForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect("news:posts")
    context = {"form": form}
    return render(request, "news/new_coin.html", context)


@login_required
def feed(request):
    followed = request.user.coin_set.all()
    posts = (
        Post.objects.filter(coin__in=followed)
        .select_related("coin")
        .prefetch_related("tag")
        .order_by("-date_added")
    )
    card_paginator = Paginator(posts, 12)
    page_num = request.GET.get("page")
    page = card_paginator.get_page(page_num)

    prices = PriceDynamic.objects.select_related("coin").all()
    pcs = []
    for i in prices:
        data = model_to_dict(i)
        data["name"] = i.coin.name
        pcs.append(data)

    return render(request, "news/feed.html", {"posts": page, "pcs": pcs})
