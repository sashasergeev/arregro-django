const url = window.location.href;

// cards
const sendSearchData = (id) => {
  const kek = [...document.getElementsByClassName('tags')].forEach((e) => e.style.border = "");
  $('#app').children().text("");
  $('#pages').text("");
  $.ajax({
      type: 'POST',
      url: 'get/',
      data: {
        'csrfmiddlewaretoken': xsrf,
        'tag_id': id,
      },
      success: (res) => {
        pages = pagination(res.data)
        const def_start_page = 1;
        render_page_content(pages, def_start_page)
        Object.keys(pages).forEach((e) => $('#pages').append(`<div class="pageNum">${e}</div>`));
        [...document.getElementsByClassName("pageNum")][0].classList.add('currentPage');
        [...document.getElementsByClassName("pageNum")].forEach(e =>
          e.addEventListener('click', () => {
            $('#app').children().text('');
            [...document.getElementsByClassName('pageNum')].forEach(p => p.classList.remove('currentPage'))
            render_page_content(pages, e.innerText);
            $(e).addClass('currentPage')
          })
        )
      },
      error: (err) => {
        console.log(err)
      },
    }),
    $(`#${id}`).css('border', 'solid');

}
// pagination
const pagination = (content) => {
  let page = content.length < 6 ? 1 : Math.round(content.length / 10);
  let pages = {};
  let pageCount = [];
  if (page == 1) {pages[1] = content} else {
    while (page > 0) {pageCount.push(page); page--;};
    pageCount.reverse().forEach((e) => {
      pages[e] = content.splice(0, 10)
    })
  }
  return pages; // at his point, i have an object(pages) with num:array of objects(cards data)
}
const render_page_content = (pages, page) => {
        pages[page].forEach((e) => {
          let card = `<div class="col-auto">
          <div class="card  bg-body">

            <div class="upper card-body ">
            <div class="d-flex sub">
              <div style="padding-right: 0.35em;">
                <span class="before-after">before: $${ e.before_price }</span>
              </div>
              <div class="">
                <span class="before-after">
                  now: $${ e.after_price }
                </span>
              </div>
            </div>
            <div class="${e.change > 0 ? 'change raise' : 'change fall' }">${e.change}%</div>

              <div class="d-flex">
                <div>
                  <h5 class="card-title mt-3" id="title">${ e.name }</h5>

                </div>

                <div class="ml-auto">
                  <img src="${e.img}" class="img-thumbnail" alt="...">
                </div>
              </div>
            </div>
            <div class="card-body">
            <div class="card-text mb-4"><span>${ e.text }...</span></div>
              <div class="d-flex">
                <div class="btn-cards">
                  <span>
                    <a href="${ e.cg_link }">
                      <img class="card-img" alt="Qries" src="https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png">
                    </a>
                  </span>
                  <a href="{{ e.tg_link }}">
                    <img class="card-img" alt="Qries" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/240px-Telegram_logo.svg.png">
                  </a>

                </div>
                <div class="ml-auto mt-1">
                  <div class="winModal" data-post-id="${e.post_id}">INFO</div>
                </div>
              </div>
            </div>
            <div class="d-flex card-footer mt-1 text-muted">
              <div>${ e.time }</div>
              <div class="ml-auto">${ e.tags }</div>
            </div>
          </div>
          </div>`
        $('#app').children().append(card)
        })
        modalsTrack()
}

// modal
const modalsTrack = () => {
  let url = `http://${window.location.host}/posts/`;
  const modal = [...document.getElementsByClassName('winModal')];
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
                                <img src="${res.modal.img}" class="img-thumbnail" alt="...">
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

    })
  })
}