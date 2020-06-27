'use strict';

(function () {
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
  var offers = getMocks();
  window.data = {
    offers: offers,
  };
})();
