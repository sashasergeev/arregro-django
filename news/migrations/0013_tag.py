# Generated by Django 3.2.3 on 2021-07-18 16:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0012_coin_followers'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=50)),
            ],
        ),
    ]