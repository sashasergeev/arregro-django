const unFollow = (id) => {
    let someStuff = `c_id=${id}`
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${window.location.host}/coins/`, true);
    xhr.setRequestHeader("X-CSRFToken", xsrf);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(someStuff);
    $(document).ready(function(){
      $(`#${id}`).children().removeClass("btn-unfollow");
      $(`#${id}`).children().addClass("btn-page");
      $(`#${id}`).children().html("Follow");
      $(`#${id}`).children().attr("onclick",`follow(${id})`)
    });
  
  };
  const follow = (id) => {
    let someStuff = `c_id=${id}&action=follow`;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${window.location.host}/coins/`, true);
    xhr.setRequestHeader("X-CSRFToken", xsrf);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(someStuff);
    $(document).ready(function(){
      $(`#${id}`).children().removeClass("btn-page");
      $(`#${id}`).children().addClass("btn-unfollow");
      $(`#${id}`).children().html("Unfollow");
      $(`#${id}`).children().attr("onclick",`unFollow(${id})`)
    });
  }