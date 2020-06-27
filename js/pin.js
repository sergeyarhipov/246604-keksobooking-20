'use strict';

(function () {
  var OFFSET_X = 25;
  var OFFSET_Y = 70;
  var MAIN_PIN_SIZE = 65;
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mainPinSizeX = parseInt(mainPin.style.left, 10) + Math.floor(MAIN_PIN_SIZE / 2);
  var mainPinSizeY = parseInt(mainPin.style.top, 10) + Math.floor(MAIN_PIN_SIZE / 2);
  var fieldsetsAndSelects = document.querySelectorAll('fieldset, select');

  window.pin = {
    mainPinSizeX: mainPinSizeX,
    mainPinSizeY: mainPinSizeY,
  };
  // Функция блокировки полей форм
  var toggleFieldsAvailability = function (isLocked) {
    for (var i = 0; i < fieldsetsAndSelects.length; i++) {
      fieldsetsAndSelects[i].disabled = isLocked;
    }
  };

  // Функции рендеринга меток на карту
  var renderMapPin = function (pin) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pinNode = pinTemplate.cloneNode(true);
    var pinAvatar = pinNode.querySelector('img');
    var coordinateX = pin.location.x - OFFSET_X;
    var coordinateY = pin.location.y - OFFSET_Y;
    pinNode.style.left = coordinateX + 'px';
    pinNode.style.top = coordinateY + 'px';
    pinAvatar.src = pin.author.avatar;
    pinAvatar.alt = pin.offer.title;

    return pinNode;
  };

  var renderMapPins = function (arrayMocks) {
    var fragment = document.createDocumentFragment();
    var mapPinsArray = arrayMocks;
    for (var i = 0; i < mapPinsArray.length; i++) {
      fragment.appendChild(renderMapPin(mapPinsArray[i]));
    }
    window.map.mapPins.appendChild(fragment);
  };

  // Функции активации формы и карты
  var activatePage = function () {
    var adForm = document.querySelector('.ad-form');
    if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

      toggleFieldsAvailability(false);
      renderMapPins(window.data.offers);

      mainPinSizeX = parseInt(mainPin.style.left, 10) + Math.floor(MAIN_PIN_SIZE / 2);
      mainPinSizeY = parseInt(mainPin.style.top, 10) + MAIN_PIN_SIZE;
      window.form.inputAdress.value = mainPinSizeX + ',' + mainPinSizeY;
    }
  };

  mainPin.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      activatePage();
    }
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      activatePage();
    }
  });

  toggleFieldsAvailability(true);
})();
