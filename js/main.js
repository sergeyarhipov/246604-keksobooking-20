'use strict';
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var OFFSET_X = 25;
var OFFSET_Y = 70;
var MAIN_PIN_SIZE = 65;

var mainPin = map.querySelector('.map__pin--main');
var fieldsetsAndSelects = document.querySelectorAll('fieldset, select');
var inputAdress = document.querySelector('#address');
var mainPinSizeX = parseInt(mainPin.style.left, 10) + Math.floor(MAIN_PIN_SIZE / 2);
var mainPinSizeY = parseInt(mainPin.style.top, 10) + Math.floor(MAIN_PIN_SIZE / 2);
var guestRoomsMap = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};
var roomsNumber = document.querySelector('#room_number');
var capacityGuests = document.querySelector('#capacity');
var typeHouse = document.querySelector('#type');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');

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
  mapPins.appendChild(fragment);
};

// Функция выбора варианта для отображения типа жилья
var defineTypeHouse = function (homeType) {
  switch (homeType) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    default:
    case 'palace':
      return 'Дворец';
  }
};

// Функция отображения фотографий предложения
var renderPhotos = function (ad, node) {
  var popupPhotos = node.querySelector('.popup__photos');
  var popupPhoto = node.querySelector('.popup__photo');
  if (ad.offer.photos.length === 0) {
    popupPhotos.classList.add('hidden');
  }

  popupPhotos.innerHTML = '';
  for (var j = 0; j < ad.offer.photos.length; j++) {
    var popupImg = popupPhoto.cloneNode(true);
    popupImg.src = ad.offer.photos[j];
    popupPhotos.appendChild(popupImg);
  }
};

// Функция для отображения/скрытия опций
var renderFeatures = function (ad, node) {
  var popupFeatures = node.querySelector('.popup__features');
  var featuresArray = popupFeatures.children;
  // Добавление скрытия (добавление класса) по умолчанию всех опций
  for (var i = 0; i < featuresArray.length; i++) {
    featuresArray[i].classList.add('hidden');
  }

  for (var j = 0; j < ad.offer.features.length; j++) {
    var popupFeature = popupFeatures.querySelector('.popup__feature--' + ad.offer.features[j]);
    popupFeature.classList.remove('hidden');
  }
};

// Функции отрисовки карточки
var renderOffer = function (ad) {
  var adTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var adNode = adTemplate.cloneNode(true);
  var popupTitle = adNode.querySelector('.popup__title');
  var popupTextAdress = adNode.querySelector('.popup__text--address');
  var popupOfferPrice = adNode.querySelector('.popup__text--price');
  var popupOfferType = adNode.querySelector('.popup__type');
  var popupTextCapacity = adNode.querySelector('.popup__text--capacity');
  var popupTextTime = adNode.querySelector('.popup__text--time');

  var popupDescription = adNode.querySelector('.popup__description');
  var popupAvatar = adNode.querySelector('.popup__avatar');

  popupTitle.textContent = ad.offer.title;
  popupTextAdress.textContent = ad.offer.address;
  popupOfferPrice.textContent = ad.offer.price + '₽/ночь';
  popupOfferType.textContent = defineTypeHouse(ad.offer.type);
  popupTextCapacity.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  popupTextTime.textContent = 'Заезд после ' + ad.offer.checkin + ',' + ' выезд до ' + ad.offer.checkout;
  popupDescription.textContent = ad.offer.description;
  popupAvatar.src = ad.author.avatar;
  renderFeatures(ad, adNode);
  renderPhotos(ad, adNode);
  return adNode;
};

// d
var renderOffers = function (ad) {
  var fragment = document.createDocumentFragment();

  fragment.appendChild(renderOffer(ad));
  mapPins.after(fragment);
  var popupClose = document.querySelector('.popup__close');
  var mapCard = document.querySelector('.map__card');
  popupClose.addEventListener('click', function () {
    mapCard.parentNode.removeChild(mapCard);
  });
};

// Функция блокировки полей форм
var toggleFieldsAvailability = function (isLocked) {
  for (var i = 0; i < fieldsetsAndSelects.length; i++) {
    fieldsetsAndSelects[i].disabled = isLocked;
  }
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
    inputAdress.value = mainPinSizeX + ',' + mainPinSizeY;

    roomsNumber.addEventListener('change', onSelectGuestsRoomsChange);
    capacityGuests.addEventListener('change', onSelectGuestsRoomsChange);
    typeHouse.addEventListener('change', function () {
      changeMinPrice(typeHouse.value);
    });
    timeIn.addEventListener('change', onSelectTimeChange.bind(null, timeIn, timeOut));
    timeOut.addEventListener('change', onSelectTimeChange.bind(null, timeOut, timeIn));
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

// Функциия проверки синхронизации полей
var onSelectGuestsRoomsChange = function () {
  if (guestRoomsMap[roomsNumber.value].indexOf(capacityGuests.value) === -1) {
    capacityGuests.setCustomValidity('Укажите допустимое количество гостей');
  } else {
    capacityGuests.setCustomValidity('');
  }
};

// Функция изменения минимального значения поля «Цена за ночь»
var changeMinPrice = function (type) {
  var minPrice = document.querySelector('#price');
  switch (type) {
    case 'bungalo':
      minPrice.min = 0;
      minPrice.placeholder = minPrice.min;
      break;
    case 'flat':
      minPrice.min = 1000;
      minPrice.placeholder = minPrice.min;
      break;
    case 'house':
      minPrice.min = 5000;
      minPrice.placeholder = minPrice.min;
      break;
    case 'palace':
      minPrice.min = 10000;
      minPrice.placeholder = minPrice.min;
  }
  return minPrice.min;
};

// Функции определения времени въезда/выезда
var onSelectTimeChange = function (time1, time2) {
  time1.value = time2.value;
};
timeIn.addEventListener('change', onSelectTimeChange.bind(null, timeOut, timeIn));
timeOut.addEventListener('change', onSelectTimeChange.bind(null, timeIn, timeOut));

// Функция отображения карточки объявления при клике по метке на карте
var onMapPinsClick = function (evt) {
  var targetMapPin = evt.target;
  var closestMapPin = targetMapPin.closest('.map__pin');
  if (!!closestMapPin && !closestMapPin.classList.contains('map__pin--main')) {
    var mapCard = document.querySelector('.map__card');
    if (mapCard !== null) {
      mapCard.parentNode.removeChild(mapCard);
    }

    var avatarSrc = closestMapPin.querySelector('img').src;

    var isTargetOffer = function (offer) {
      return avatarSrc.includes(offer.author.avatar);
    };

    var targetElement = window.data.offers.find(isTargetOffer);
    renderOffers(targetElement);
  }
};

// Обработчики событий Popup
// Обработчики открытия Popup
mapPins.addEventListener('click', onMapPinsClick);
mapPins.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    onMapPinsClick(evt);
  }
});

// Обработчики закрытия Popup
document.addEventListener('keydown', function (evt) {
  var mapCard = document.querySelector('.map__card');
  if (evt.key === 'Escape') {
    if (mapCard !== null) {
      mapCard.parentNode.removeChild(mapCard);
    }
  }
});


inputAdress.value = mainPinSizeX + ',' + mainPinSizeY;
inputAdress.setAttribute('readonly', 'readonly');
toggleFieldsAvailability(true);
onSelectGuestsRoomsChange();
changeMinPrice(typeHouse);
