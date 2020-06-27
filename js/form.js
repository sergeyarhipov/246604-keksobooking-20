'use strict';

(function () {
  var inputAdress = document.querySelector('#address');

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

  window.form = {
    inputAdress: inputAdress,
    roomsNumber: roomsNumber,
    capacityGuests: capacityGuests,
    typeHouse: typeHouse,
    timeIn: timeIn,
    timeOut: timeOut,
  };

  // Функция проверки синхронизации полей
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

  inputAdress.value = window.pin.mainPinSizeX + ',' + window.pin.mainPinSizeY;
  inputAdress.setAttribute('readonly', 'readonly');
  onSelectGuestsRoomsChange();
  changeMinPrice(typeHouse);

  roomsNumber.addEventListener('change', onSelectGuestsRoomsChange);
  capacityGuests.addEventListener('change', onSelectGuestsRoomsChange);
  typeHouse.addEventListener('change', function () {
    changeMinPrice(typeHouse.value);
  });
  window.form.timeIn.addEventListener('change', onSelectTimeChange.bind(null, window.form.timeIn, window.form.timeOut));
  window.form.timeOut.addEventListener('change', onSelectTimeChange.bind(null, window.form.timeOut, window.form.timeIn));
})();
