# Generated by Django 3.2.3 on 2021-07-21 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0016_remove_post_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='price1hr',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='post',
            name='price2hr',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
