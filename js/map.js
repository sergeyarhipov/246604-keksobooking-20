'use strict';

(function () {
  var mapPins = document.querySelector('.map__pins');
  window.map = {
    mapPins: mapPins,
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

  // Функция для добавления/удаления карточки
  function renderOffers(ad) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(renderOffer(ad));
    mapPins.after(fragment);
    var popupClose = document.querySelector('.popup__close');
    var mapCard = document.querySelector('.map__card');
    popupClose.addEventListener('click', function () {
      mapCard.parentNode.removeChild(mapCard);
    });
  }

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
})();
