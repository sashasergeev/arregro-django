# Generated by Django 3.2.3 on 2021-07-18 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0013_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='tag',
            field=models.ManyToManyField(to='news.Tag'),
        ),
    ]