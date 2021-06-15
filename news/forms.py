from django import forms
from .models import CoinSubmit


class CoinForm(forms.ModelForm):
    class Meta:
        model = CoinSubmit
        fields = ['coin', 'cg_link']
        labels = {
            'coin': 'Coin',
            'cg_link': 'CoinGecko',
        }