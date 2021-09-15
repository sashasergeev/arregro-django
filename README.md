# Arregro Django
The platform for watching last crypto news from social medias, news picked by keywords,

On the news page users can see cards with info of the last posts and prices before and after news. Also they can press info button to open modal where they can see how price has changed aftter a news in a 1h 2h and change with the current price. On the coins page they can find the coin they want, follow them and go to the coin detail page, where they can see all the news that are in a db.

Users can login/signup, follow/unfollow coins so they will have personal feed. Also user can submit the coin they want to see in the project.

## Technologies used:
### Frontend
```
HTML
CSS
Bootstrap4
Vanilla JavaScript
WinBox (Library for modals)
```
### Backend
```
Django Framework
MySQL
Redis (for celery)

Libraries:
- Celery - for making background tasks (api requests to CoinGecko to get actual prices)
- Channels - to send actual prices through WebSockets
```
## Instruction to run this project

1. You need to dl/clone this repository to your device.
2. Activate your virtualenv.
3. Run ```pip install -r requirements.txt``` in your shell.
4. Download redis server to your computer, install and connect it in ```cna/settings.py```.
5. Connect your database in ```cna/settings.py```.
6. Run ```python manage.py runserver``` in your shell.
7. To run celery, you need to run these two commands:
```
celery -A cna beat -l INFO
celery -A cna worker --loglevel=INFO --concurrency 1 -P solo
```

Need to notice, the script, that look up the news is separeted from the site. It runs and writes data to the db (MySQL). [Link to the repository](https://github.com/sashasergeev/telegram-realtime-crawler)
