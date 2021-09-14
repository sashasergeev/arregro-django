//     SEARCHBAR WIDENER
const search = document.getElementById('search-form');
const sRes = document.getElementById('search-input')
const results = document.getElementById('results-box')
const url = window.location.href.split('?')[0]

const coinsNum = document.getElementById('coinsNum');
const button = document.getElementById('next');

//  focus and widening
search.addEventListener('focus', (event) => {
  coinsNum.style.display = 'none';
  button.style.display = 'none';
  event.target.style.width = `${window.innerWidth * 0.6}px`;
  event.target.style.position = "absolute";
  event.target.style.transform = 'translate(5%, -50%)';

  results.style.width = `${sRes.offsetWidth}px`
  results.style.position = "absolute"
  results.style.transform = 'translateX(33%) translateY(0%)'
  results.style['z-index'] = '100'
}, true)
// return to the basement
search.addEventListener('blur', (event) => {
  if (sRes.value == 0 && results.innerHTML == "") {
  coinsNum.style.display = 'inline';
  button.style.display = 'inline';
  event.target.style.position = "";
  event.target.style.transform = '';
  event.target.style.width = 'auto';
  results.style.display = 'none';
  }

}, true);

// search functionality
sRes.addEventListener('keyup', e => {
  results.style.display = e.target.value.length != 0 ? '' : 'none';
  sendSearchData(e.target.value);
})

const sendSearchData = (coin) => {
  $.ajax({
    type: 'POST',
    url: 'search/',
    data: {
      'csrfmiddlewaretoken': xsrf,
      'coin': coin,
    },
    success: (res) => {
      results.innerHTML= '';
      res.data.some((e, inx) => {
        if (inx == 19) {
          results.innerHTML += `<div>+${res.data.length} results...</div>`
          return true;
          }
        results.innerHTML += `<a href=${url}${e.pk}><div>${e.name}</div><a>`
      })
    },
    error: (err) => {
      console.log(err)
    },
  })
}