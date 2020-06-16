'use strict';
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var MAX_PRICE = 10000;
var MIN_ROOMS_GUESTS = 1;
var MAX_ROOMS = 5;
var MAX_GUESTS = 4;
var MAX_PHOTOS = 3;
var OFFER_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']; // Массив опций
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;
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

// Функция подбора случайного числа
var getRandomNumber = function (number) {
  return Math.floor(Math.random() * (number + 1));
};

var getRandomNumberFromRange = function (numberMin, numberMax) {
  return Math.floor(Math.random() * (numberMax - numberMin + 1) + numberMin);
};

// Функция для генерации фотографий для объекта
var getPhotos = function () {
  var photos = []; // Массив фотографий
  for (var i = 0; i < getRandomNumber(MAX_PHOTOS); i++) {
    photos[i] = 'http://o0.github.io/assets/images/tokyo/hotel' + (i + 1) + '.jpg';
  }
  return photos;
};

// Функция подбора дополнительных опций
var getFeatures = function () {
  var numberOptions = getRandomNumber(OFFER_FEATURES.length - 1); // Определение количества опций
  var cloneOfferFeatures = OFFER_FEATURES.slice();
  var choiceOptions = [];
  for (var i = 0; i < numberOptions; i++) {
    var randomOption = getRandomNumber(cloneOfferFeatures.length - 1); // Подбор порядкового номера опции из массива
    choiceOptions.push(cloneOfferFeatures[randomOption]);
    cloneOfferFeatures.splice(randomOption, 1);
  }
  return choiceOptions;
};

// Функция создания массива из 8 сгенерированных JS-объектов
var getMocks = function () {

  var mockArray = [];
  for (var i = 0; i < 8; i++) {
    var offerPrice = getRandomNumber(MAX_PRICE);
    var offerType = getRandomNumber(OFFER_TYPES.length - 1);
    var offerQuantityRooms = getRandomNumberFromRange(MIN_ROOMS_GUESTS, MAX_ROOMS);
    var offerQuantityGuests = getRandomNumberFromRange(MIN_ROOMS_GUESTS, MAX_GUESTS);
    var offerCheckinIndex = getRandomNumber(OFFER_TIMES.length - 1);
    var offerCheckoutIndex = offerCheckinIndex;
    var locationX = getRandomNumber(MAX_X);
    var locationY = getRandomNumberFromRange(MIN_Y, MAX_Y);

    var mockObject = {
      'author': {
        'avatar': 'img/avatars/user' + '0' + (i + 1) + '.png'
      },
      'offer': {
        'title': 'Заголовок предложения',
        'address': locationX + ',' + locationY,
        'price': offerPrice,
        'type': OFFER_TYPES[offerType],
        'rooms': offerQuantityRooms,
        'guests': offerQuantityGuests,
        'checkin': OFFER_TIMES[offerCheckinIndex],
        'checkout': OFFER_TIMES[offerCheckoutIndex],
        'features': getFeatures(),
        'description': 'Текст описания',
        'photos': getPhotos()
      },
      'location': {
        'x': locationX,
        'y': locationY
      },
    };
    mockArray.push(mockObject);
  }
  return mockArray;
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

var renderOffers = function (ad) {
  var fragment = document.createDocumentFragment();

  fragment.appendChild(renderOffer(ad));
  mapPins.after(fragment);
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
    renderMapPins(offers);

    mainPinSizeX = parseInt(mainPin.style.left, 10) + Math.floor(MAIN_PIN_SIZE / 2);
    mainPinSizeY = parseInt(mainPin.style.top, 10) + MAIN_PIN_SIZE;
    inputAdress.value = mainPinSizeX + ',' + mainPinSizeY;

    roomsNumber.addEventListener('change', synchronizeFields);
    capacityGuests.addEventListener('change', synchronizeFields);
    typeHouse.addEventListener('change', changeMinPrice);
    timeIn.addEventListener('change', defineTimeIn);
    timeOut.addEventListener('change', defineTimeOut);
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
var synchronizeFields = function () {
  if (guestRoomsMap[roomsNumber.value].indexOf(capacityGuests.value) === -1) {
    capacityGuests.setCustomValidity('Укажите допустимое количество гостей');
  } else {
    capacityGuests.setCustomValidity('');
  }
};

// Функция изменения минимального значения поля «Цена за ночь»
var changeMinPrice = function () {
  var minPrice = document.querySelector('#price');
  if (typeHouse.value === 'bungalo') {
    minPrice.placeholder = 0;
    minPrice.min = 0;
  } else if (typeHouse.value === 'flat') {
    minPrice.placeholder = 1000;
    minPrice.min = 1000;
  } else if (typeHouse.value === 'house') {
    minPrice.placeholder = 5000;
    minPrice.min = 5000;
  } else if (typeHouse.value === 'palace') {
    minPrice.placeholder = 10000;
    minPrice.min = 10000;
  }
};

// Функции определения времени въезда/выезда
var defineTimeIn = function () {
  timeOut.value = timeIn.value;
};

var defineTimeOut = function () {
  timeIn.value = timeOut.value;
};

var offers = getMocks();
inputAdress.value = mainPinSizeX + ',' + mainPinSizeY;
inputAdress.setAttribute('readonly', 'readonly');
toggleFieldsAvailability(true);
synchronizeFields();
changeMinPrice();

// Функция отображения карточки объявления при клике по метке на карте
var showOffer = function (evt) {
  var mapCard = document.querySelector('.map__card');
  if (mapCard !== null) {
    mapCard.parentNode.removeChild(mapCard);
  }

  var targetMapPins = evt.target;
  var isMapPinMain = targetMapPins.classList.contains('map__pin--main');
  var targetMapPinsSrc = targetMapPins.src;
  if (!isMapPinMain) {
    for (var i = 0; i < offers.length; i++) {
      window.close = document.querySelector('.popup__close');
      var avatarSrc = 'img/avatars/user' + '0' + (i + 1);
      if (targetMapPins.hasAttribute('alt') && targetMapPinsSrc.includes(avatarSrc)) {
        renderOffers(offers[i]);
      }

      if (targetMapPins.hasAttribute('type')) {
        var targetImg = targetMapPins.querySelector('img');
        targetMapPinsSrc = targetImg.src;
        if (targetMapPinsSrc.includes(avatarSrc)) {
          renderOffers(offers[i]);
        }
      }
    }
  }
};

// Функции удаления карточки объявления из разметки при клике по кнопке "Закрыть"
var closeOfferClick = function (evt) {
  var targetClosePopup = evt.target;
  var mapCard = document.querySelector('.map__card');
  var isPopupClose = targetClosePopup.classList.contains('popup__close');
  if (isPopupClose) {
    mapCard.parentNode.removeChild(mapCard);
  }
};

// Функции удаления карточки объявления из разметки при нажатии на кнопку "Escape"
var closeOfferEsc = function () {
  var mapCard = document.querySelector('.map__card');
  mapCard.parentNode.removeChild(mapCard);
};

// Обработчики событий Popup
// Обработчики открытия Popup
mapPins.addEventListener('click', showOffer);
mapPins.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    showOffer();
  }
});

// Обработчики закрытия Popup
map.addEventListener('click', closeOfferClick);
document.addEventListener('keydown', function (evt) {
  var mapCard = document.querySelector('.map__card');
  if (evt.key === 'Escape') {
    if (mapCard !== null) {
      closeOfferEsc();
    }
  }
});
