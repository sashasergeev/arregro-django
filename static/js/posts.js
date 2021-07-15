const pcs = JSON.parse(document.getElementById('pcs').textContent);


const { createApp: Appl } = Vue;
const PricesApp = {
    delimiters: ['[[', ']]'],
    data(){
        return {
            prices: pcs,
        }
    },
    created(){
        const socket = new WebSocket('ws://' + window.location.host + '/ws/prices/');

        let _this = this;
        socket.onmessage = function(event) {
            _this.prices = JSON.parse(event.data);
            console.log(_this.prices);
        }
    }
}
Appl(PricesApp).mount('#app')





function priceChange() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(function (card) {
    const before = card.querySelector('.before-after').outerText.split('$')[1];
    const after = card.querySelectorAll('.before-after')[1].outerText.split('$')[1];
    const change = (Math.floor(((after / before - 1)*100) * 100) / 100);
    if (change < 0) {
      card.querySelector('.change').innerHTML = `<div class="change fall">${change}%</div>`;
    } else {
      card.querySelector('.change').innerHTML = `<div class="change raise">${change}%</div>`;
    }
})}
setInterval(priceChange, 5000);

priceChange()
