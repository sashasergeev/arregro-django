# Generated by Django 3.2.3 on 2021-07-18 20:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0014_post_tag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='tag',
            field=models.ManyToManyField(blank=True, null=True, to='news.Tag'),
        ),
    ]
