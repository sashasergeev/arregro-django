
// websocket connection * price upd
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
            priceChange()
        }
    }
}
Appl(PricesApp).mount('#app')

// calculates a change of a price
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
priceChange()

// modals created via WinBox.js
const url = window.location.href;
const xsrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const modal = [...document.getElementsByClassName('winModal')]
modal.forEach(e => {
  e.addEventListener('click', () => {

    $.ajax({
          type: 'POST',
          url: `http://${window.location.host}/posts/post/`,
          data: {
            'csrfmiddlewaretoken': xsrf,
            'post_id': e.dataset.postId,
          },
          success: (res) => {

            const modal = new WinBox({
                title: `${res.modal.name} - post:${e.dataset.postId} `,
                root: document.getElementById('btns'),
                html:  `<div class="modalUp d-flex justify-content-around align-items-center ">
                            <div class="modalTitle">
                                <span class="h3">${res.modal.name}</span>
                            </div>
                            <div class="modalImg" >
                                <img src="${res.modal.img}" class="" alt="...">
                            </div>
                        </div>

                        <div class="modalPrices">
                            <table>
                                <tr>
                                    <td>0 point</td>
                                    <td>1 hr</td>
                                    <td>2 hrs</td>
                                    <td>current</td>
                                </tr>
                                <tr>
                                    <td>${res.modal.before}</td>
                                    <td>${res.modal['1hr']}</td>
                                    <td>${res.modal['2hr']}</td>
                                    <td>${res.modal.after}</td>
                                </tr
                                <tr>
                                    <td>change</td>
                                    <td class=${(Math.floor(((res.modal['1hr'] / res.modal.before - 1) *100) * 100) / 100) < 0 ? "fall" : "raise"}>
                                        ${(Math.floor(((res.modal['1hr'] / res.modal.before - 1) *100) * 100) / 100)}%</td>
                                    <td class=${(Math.floor(((res.modal['2hr'] / res.modal.before - 1) *100) * 100) / 100) < 0 ? "fall" : "raise"}>
                                        ${(Math.floor(((res.modal['2hr'] / res.modal.before - 1) *100) * 100) / 100)}%</td>
                                    <td class=${(Math.floor(((res.modal.after / res.modal.before - 1) *100) * 100) / 100) < 0 ? "fall":"raise"}>
                                        ${(Math.floor(((res.modal.after / res.modal.before - 1) *100) * 100) / 100)}%</td>
                                </tr>
                            </table>
                        </div>
                        <div class="tagsSocials d-flex justify-content-around align-items-center ">
                            <div class="modalTags">
                                <span>${res.modal.tags}</span>
                            </div
                            <div class="modalSocials">
                                <a href="${ res.modal.cg_link }">
                                    <img class="card-img" alt="Qries" src="https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png">
                                </a>
                                <a href="${ res.modal.tg_link }">
                                    <img class="card-img" alt="Qries" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/240px-Telegram_logo.svg.png">
                                </a>

                            </div>
                        </div>
                        <div class="modalText">
                            <div>${res.modal.text}</div>
                        </div>


                        `,
                background: '#52b788',
                x: "center",
                y: "center",
                height: "50%",
                width: $(window).width() > 800 ? "30%" : "80%",
                onfocus: function(){
                    this.setBackground("#52b788");
                },
                onblur: function(){
                    this.setBackground("#999");
                },
            });

          },
          error: (err) => {
            console.log(err)
          },
        })
  });
});


