import {
  COUNTRYS_API_LIST,
  CRYPTO_API_LIST,
  CONVERT_DOLARS_CRYPTO,
  API_KEY,
} from "./utils.js";

let arrayHistoricalCurrency = [];
let arrayHistoricalCrypto = [];

function formatDate(dateObj) {
  return dateObj.toISOString().split("T")[0];
}

setDateMax();

function setDateMax() {
  const now = new Date();
  const today = formatDate(now);
  document.querySelector("#date-convert").setAttribute("max", today);
}

function getListOfCountrys() {
  fetch(COUNTRYS_API_LIST)
    .then((res) => res.json())
    .then((list) => {
      for (let code in list.currencies) {
        document.querySelector("#sel-traditional-currency").innerHTML += `
        <option value="${code}">${list.currencies[code]}</option>
      `;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

getListOfCountrys();
function getListOfCryptos() {
  fetch(CRYPTO_API_LIST)
    .then((res) => res.json())
    .then((list) => {
      list.slice(0, 50).map((list) => {
        document.querySelector("#sel-crypto-currency").innerHTML += `
        <option value="${list.id}">${list.name}</option>`;
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

getListOfCryptos();
addEventForm();

function addEventForm() {
  document
    .querySelector("#form-convert")
    .addEventListener("submit", eventSubmitForm);
}

function getDateFromForm() {
  return {
    from: document.querySelector("#sel-traditional-currency").value,
    to: document.querySelector("#sel-crypto-currency").value,
    amount: document.querySelector("#input-convert").value,
    date: document.querySelector("#date-input").value,
  };
}

function eventSubmitForm(event) {
  event.preventDefault();
  const data = getDateFromForm();
  convertCurrencyToDolars(data);
  getListAndGraphicalData(data);
  getGraphic(data, arrayHistoricalCurrency, arrayHistoricalCrypto);
}

function convertCurrencyToDolars(data) {
  fetch(
    `https://api.getgeoapi.com/v2/currency/convert?${API_KEY}&from=${data.from}&to=USD&amount=${data.amount}`
  )
    .then((res) => res.json())
    .then((resAmount) => {
      const convertDolarsToCrypto = {
        quote_currency_id: document.querySelector("#sel-crypto-currency").value,
        amount: resAmount.rates.USD.rate_for_amount,
      };
      fetch(
        `${CONVERT_DOLARS_CRYPTO}quote_currency_id=${convertDolarsToCrypto.quote_currency_id}&amount=${convertDolarsToCrypto.amount}`
      )
        .then((res) => res.json())
        .then((crypto_converted) => {
          document.querySelector("#price-result").innerHTML =
            crypto_converted.price.toFixed(2);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

function calcularFechaFinal(date) {
  const dateObj = new Date(date);

  dateObj.setDate(dateObj.getDate() - 7);
  console.log(dateObj, "dateObj");
  return formatDate(dateObj);
}

function getListAndGraphicalData(data) {
  const finalDate = calcularFechaFinal(data.date);
  console.log(finalDate, "finalDate");
  fetch(
    `https://api.frankfurter.app/${finalDate}..${data.date}?from=${data.from}&to=USD`
  )
    .then((res) => res.json())
    .then((resDate) => {
      console.log(resDate.rates, "resDate currency list");
      arrayHistoricalCrypto = resDate.rates;
      getGraphic(arrayHistoricalCrypto, arrayHistoricalCurrency);
    });
  fetch(
    `https://api.coinpaprika.com/v1/tickers/${data.to}/historical?interval=1d&start=${finalDate}&end=${data.date}`
  )
    .then((res) => res.json())
    .then((resDate) => {
      arrayHistoricalCurrency = resDate;
      console.log(
        arrayHistoricalCurrency,
        "arrayHistoricalCurrency pepedonjuan"
      );
      getGraphic(arrayHistoricalCurrency, arrayHistoricalCrypto);
    });
}

let labelsCoins = [];
let labelDates = [];

function getGraphic(cryptos, currencies) {
  labelsCoins = [];
  labelDates = [];
  var valueOfCrypto = 0;

  for (let i = 0; i < cryptos.length; i++) {
    const objTimeStapm = new Date(cryptos[i].timestamp);
    // cryptos[i].timestamp = new Date;
    const dateCryptoArray = formatDate(objTimeStapm);
    if (currencies[dateCryptoArray] !== undefined) {
      valueOfCrypto = cryptos[i].price / currencies[dateCryptoArray].USD;
    }
    labelsCoins.push(valueOfCrypto);
    labelDates.push(dateCryptoArray);
    console.log(labelDates, "fechas");
    console.log(labelsCoins, "labelsCoins");

    new Chartist.LineChart(
      "#graphic",
      {
        labels: labelDates,
        series: [labelsCoins],
      },
      {
        showArea: true,
        fullWidth: true,
        showPoint: false,
        axisX: {
          showLabel: false,
          showGrid: false,
        },
      }
    );
  }
}
