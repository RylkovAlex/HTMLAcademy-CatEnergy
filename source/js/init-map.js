var desktop_width = window.matchMedia("screen and (min-width: 1300px)");
var mobile_width = window.matchMedia("screen and (max-width: 767px)");
desktop_width.addListener(setup_for_width);
// переменные для координат центра карты и маркера:
    var center_lat, center_lng, pin_lat = 59.938738, pin_lng = 30.323059;
// картинка:
var image = 'img/map-pin.png';
// Функция для переопределения переменных в зависимости от ширины экрана:
function setup_for_width(desktop_width) {
  if (desktop_width.matches) {
    center_lat = 59.939048;
    center_lng = 30.3193848;
  } else {
    // ширина экрана меньше 1300 пикселей:
    center_lat = pin_lat + 0.0003;
    center_lng = pin_lng;
  }
  // ширина экрана меньше 768 пикселей:
  if (mobile_width.matches) {
    center_lat = pin_lat;
    image = 'img/map-pin-png-50.png';
  }
}

setup_for_width(desktop_width);

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: {lat: center_lat, lng: center_lng}
    });

    var beachMarker = new google.maps.Marker({
      position: {lat: pin_lat, lng: pin_lng},
      map: map,
      icon: image
    });
  }
