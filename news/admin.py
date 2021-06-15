from django.contrib import admin
from .models import Coin, Post, PriceDynamic
# Register your models here.

admin.site.register(Coin)
admin.site.register(Post)
admin.site.register(PriceDynamic)
