# Generated by Django 3.2.3 on 2021-06-09 20:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0009_pricedynamic_cg_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pricedynamic',
            name='coin',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='prices', to='news.coin'),
        ),
    ]
