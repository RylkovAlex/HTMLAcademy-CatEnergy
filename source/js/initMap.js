var mql = window.matchMedia("screen and (min-width: 768px)");
mql.addListener(setup_for_width);
// переменные для координат центра карты и маркера:
    var center_lat, center_lng, pin_lat = 59.938738, pin_lng = 30.323059;
// картинка:
var image = 'img/map-pin.png';
// Функция для переопределения переменных в зависимости от ширины экрана:
function setup_for_width(mql) {
  if (mql.matches) {
    center_lat = 59.939048;
    center_lng = 30.3189848;
  } else {
    // ширина экрана меньше 768 пикселей:
    center_lat = pin_lat;
    center_lng = pin_lng;
    image = 'img/map-pin-png-50.png';
  }
}

setup_for_width(mql);

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
