'use strict';
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');

map.classList.remove('map--faded');

// Функция подбора случайного числа
var getRandomNumber = function (number) {
  return Math.floor(Math.random() * (number + 1));
};

var getRandomNumberFromRange = function (numberMin, numberMax) {
  return Math.floor(Math.random() * (numberMax - numberMin + 1) + numberMin);
};

// Функция создания массива из 8 сгенерированных JS-объектов
var getMockBase = function () {
  var MAX_PRICE = 10000;
  var MAX_ROOMS = 5;
  var MAX_GUESTS = 4;
  var MAX_PHOTOS = 8;
  var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']; // Массив опций
  var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var MAX_X = 1200;
  var MIN_Y = 130;
  var MAX_Y = 630;

  var mockArray = [];
  // Функция для генерации фотографий для объекта
  var getQuantityPhotos = function () {
    var arrayPhotos = []; // Массив фотографий
    for (var i = 0; i < getRandomNumber(MAX_PHOTOS); i++) {
      arrayPhotos[i] = 'http://o0.github.io/assets/images/tokyo/hotel' + (i + 1) + '.jpg';
    }
    return arrayPhotos;
  };

  // Функция подбора дополнительных опций
  var getFeaturesOption = function () {
    var quantityOptions = getRandomNumber(OFFER_FEATURES.length); // Определение количества опций
    var choiceOptions = []; // Массив порядковых номеров отобранных опций
    for (var i = 0; i < quantityOptions; i++) {
      var RandomOption = getRandomNumber(OFFER_FEATURES.length); // Подбор порядкового номера опции из массива опций
      if (choiceOptions.indexOf(RandomOption) !== -1) {
        continue;
      }
      choiceOptions.push(RandomOption);
    }

    var selectOptions = []; // Массив отобранных опций
    for (var j = 0; j < choiceOptions.length; j++) {
      selectOptions.push(OFFER_FEATURES[choiceOptions[j]]);
    }

    for (var k = 0; k < selectOptions.length; k++) {
      if (typeof selectOptions[k] === 'undefined') {
        selectOptions.splice(k, 1);
      }
    }

    return selectOptions;
  };

  for (var i = 0; i < 8; i++) {
    var offerPrice = getRandomNumber(MAX_PRICE);
    var offerType = getRandomNumber(OFFER_TYPE.length - 1);
    var offerQuantityRooms = getRandomNumber(MAX_ROOMS);
    var offerQuantityGuests = getRandomNumber(MAX_GUESTS);
    var offerCheckinIndex = getRandomNumber(OFFER_CHECKIN.length - 1);
    var locationX = getRandomNumber(MAX_X); // Функция подбора рандомных значений
    var locationY = getRandomNumberFromRange(MIN_Y, MAX_Y); // Функция подбора рандомных значений

    var mockObject = {
      'author': {
        'avatar': 'img/avatars/user' + '0' + (i + 1) + '.png'
      },
      'offer': {
        'title': 'Заголовок предложения',
        'address': locationX + ',' + locationY,
        'price': offerPrice,
        'type': OFFER_TYPE[offerType],
        'rooms': offerQuantityRooms,
        'guests': offerQuantityGuests,
        'checkin': OFFER_CHECKIN[offerCheckinIndex],
        'checkout': OFFER_CHECKIN[offerCheckinIndex],
        'features': getFeaturesOption(),
        'description': 'Текст описания',
        'photos': getQuantityPhotos()
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

var renderMapLabel = function (pin) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinLabel = pinTemplate.cloneNode(true);
  var pinAvatar = pinLabel.querySelector('img');
  var coordinateX = pin.location.x - 62;
  var coordinateY = pin.location.y - 62;
  pinLabel.style.left = coordinateX + 'px';
  pinLabel.style.top = coordinateY + 'px';
  pinAvatar.src = pin.author.avatar;
  pinAvatar.alt = pin.offerTitle;

  return pinLabel;
};

var renderMapPins = function () {
  var fragment = document.createDocumentFragment();
  var mapPinsArray = getMockBase();
  for (var i = 0; i < mapPinsArray.length; i++) {
    fragment.appendChild(renderMapLabel(mapPinsArray[i]));
  }
  mapPins.appendChild(fragment);
};

renderMapPins();
