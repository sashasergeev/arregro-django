import os
from celery import Celery

# need tp show it the path to the setting path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cna.settings')
# it gets the directory that contains celery.py
app = Celery('cna')
# to give it a prefix to use in a settings.py module
app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    'get_coins_price_10s': {
        'task': 'news.tasks.get_coins_price',
        'schedule': 10.0,
    }

}

app.autodiscover_tasks()