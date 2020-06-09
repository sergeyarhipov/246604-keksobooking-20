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
    var offerCheckoutIndex = getRandomNumber(OFFER_TIMES.length - 1);
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

var offers = getMocks();

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
      return 'Дворец';
  }
};

// Функция отображения фотографий предложения
var renderPhotos = function (arrayMockPhotos) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardNode = cardTemplate.cloneNode(true);
  var popupPhotos = cardNode.querySelector('.popup__photos');
  var popupPhoto = cardNode.querySelector('.popup__photo');
  var popupMock = arrayMockPhotos;
  console.log(popupMock[0].offer.photos);
  if (popupMock[0].offer.photos.length === 0) {
    popupPhotos.classList.add('hidden');
  }

  popupPhotos.innerHTML = '';
  for (var j = 0; j < popupMock[0].offer.photos.length; j++) {
    var popupImg = popupPhoto.cloneNode(true);
    popupImg.src = popupMock[0].offer.photos[j];
    popupPhotos.appendChild(popupImg);
  }
  console.log(popupPhotos);
};

// Функция для отображения/скрытия опций
var renderFeatures = function (arrayMockFeatures) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardNode = cardTemplate.cloneNode(true);
  var popupFeatures = cardNode.querySelector('.popup__features');
  var featuresArray = popupFeatures.children;
  // Добавление скрытия (добавление класса) по умолчанию всех опций
  for (var i = 0; i < featuresArray.length; i++) {
    featuresArray[i].classList.add('hidden');
  }

  for (var j = 0; j < arrayMockFeatures[0].offer.features.length; j++) {
    var popupFeature = popupFeatures.querySelector('.popup__feature--' + arrayMockFeatures[0].offer.features[j]);
    popupFeature.classList.remove('hidden');
  }
};

var renderCards = function (card) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardNode = cardTemplate.cloneNode(true);
  var popupTitle = cardNode.querySelector('.popup__title');
  var popupTextAdress = cardNode.querySelector('.popup__text--address');
  var popupOfferPrice = cardNode.querySelector('.popup__text--price');
  var popupOfferType = cardNode.querySelector('.popup__type');
  var popupTextCapacity = cardNode.querySelector('.popup__text--capacity');
  var popupTextTime = cardNode.querySelector('.popup__text--time');

  var popupDescription = cardNode.querySelector('.popup__description');
  var popupAvatar = cardNode.querySelector('.popup__avatar');

  popupTitle.textContent = card.offer.title;
  popupTextAdress.textContent = card.offer.address;
  popupOfferPrice.textContent = card.offer.price + '₽/ночь';
  popupOfferType.textContent = defineTypeHouse(card.offer.type);
  popupTextCapacity.textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  popupTextTime.textContent = 'Заезд после ' + card.offer.checkin + ',' + ' выезд до ' + card.offer.checkout;
  popupDescription.textContent = card.offer.description;
  popupAvatar.src = card.author.avatar;
  renderFeatures(offers);
  renderPhotos(offers);
  return cardNode;
};

var renderCard = function () {
  var fragment = document.createDocumentFragment();
  var cardsArray = offers;

  fragment.appendChild(renderCards(cardsArray[0]));
  mapPins.after(fragment);
};

map.classList.remove('map--faded');

renderMapPins(offers);
renderCard();
