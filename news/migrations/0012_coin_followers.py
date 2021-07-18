# Generated by Django 3.2.3 on 2021-07-15 19:39

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('news', '0011_coinsubmit'),
    ]

    operations = [
        migrations.AddField(
            model_name='coin',
            name='followers',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
