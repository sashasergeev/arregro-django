from django.contrib import admin
from .models import Coin, Post, PriceDynamic, Tag
# Register your models here.

admin.site.register(Coin)
admin.site.register(Post)
admin.site.register(PriceDynamic)
admin.site.register(Tag)
