import {
  COUNTRYS_API_LIST,
  CRYPTO_API_LIST,
  CONVERT_DOLARS_CRYPTO,
  API_KEY,
} from "./utils.js";

// .querySelector("#form-convertir")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();

//     const datos = {
//       from: document.querySelector("#sel-moneda-inicial").value,
//       to: document.querySelector("#sel-moneda-final").value,
//       amount: document.querySelector("#inp-monto").value,
//       };

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
  var listHistoricalCurrency = '';
  var listHistoricalCrypto = '';
  console.log(data);
  convertCurrencyToDolars(data);
  console.log(data.date);
  rangeHistoricallyUsdToCurrency(data, listHistoricalCurrency);
  rageHistoricalCryptoToUsd(data, listHistoricalCrypto);
  getGraphicalData(data, listHistoricalCurrency, listHistoricalCrypto);
}

function convertCurrencyToDolars(data) {
  fetch(
    `https://api.getgeoapi.com/v2/currency/convert?${API_KEY}&from=${data.from}&to=USD&amount=${data.amount}`
  )
    .then((res) => res.json())
    .then((resAmount) => {
      console.log(resAmount.rates.USD.rate_for_amount, "traditional to dolars");
      const convertDolarsToCrypto = {
        quote_currency_id: document.querySelector("#sel-crypto-currency").value,
        amount: resAmount.rates.USD.rate_for_amount,
      };
      fetch(
        `${CONVERT_DOLARS_CRYPTO}quote_currency_id=${convertDolarsToCrypto.quote_currency_id}&amount=${convertDolarsToCrypto.amount}`
      )
        .then((res) => res.json())
        .then((crypto_converted) => {
          console.log(crypto_converted, "dolars to crypto");
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

function rangeHistoricallyUsdToCurrency(data, listHistoricalCurrency) {
  const finalDate = calcularFechaFinal(data.date);
  fetch(
    `https://api.frankfurter.app/${finalDate}..${data.date}?from=${data.from}&to=USD`
  )
    .then((res) => res.json())
    .then((resDate) => {
      console.log(resDate.rates, "resDate");
      listHistoricalCurrency = resDate.rates;
      console.log(listHistoricalCurrency, "next");
    });
}

function rageHistoricalCryptoToUsd(data, listHistoricalCrypto) {
  console.log(data, "data crypto");
  const finalDate = calcularFechaFinal(data.date);
  console.log(finalDate, "finalDateCrypto");
  fetch(`https://api.coinpaprika.com/v1/tickers/${data.to}/historical?interval=1d&start=${finalDate}&end=${data.date}`)
    .then((res) => res.json())
    .then((resDate) => {
      console.log(resDate, "resDateCrypto");
      listHistoricalCrypto = resDate;
      console.log(listHistoricalCrypto, "next2");
    });
}

function getGraphicalData(data, listHistoricalCurrency, listHistoricalCrypto) {
  console.log(data, "data", listHistoricalCurrency, "listHistoricalCurrency", listHistoricalCrypto, "listHistoricalCrypto");
}

// document.querySelector("#form-convert").addEventListener("submit", (event) => {
//   event.preventDefault();

//   const convertTraditionalToDolars = {};

//   fetch(
//     `https://api.getgeoapi.com/v2/currency/convert?${API_KEY}&from=${convertTraditionalToDolars.from}&to=USD&amount=${convertTraditionalToDolars.amount}`
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data.rates.USD.rate_for_amount, "traditional to dolars");
//       const convertDolarsToCrypto = {
//         quote_currency_id: document.querySelector("#sel-crypto-currency").value,
//         amount: data.rates.USD.rate_for_amount,
//       };
//       fetch(
//         `${CONVERT_DOLARS_CRYPTO}quote_currency_id=${convertDolarsToCrypto.quote_currency_id}&amount=${convertDolarsToCrypto.amount}`
//       )
//         .then((res) => res.json())
//         .then((crypto_converted) => {
//           console.log(crypto_converted, "dolars to crypto");
//           document.querySelector("#price-result").innerHTML =
//             crypto_converted.price.toFixed(2);
//         });
//     });
// });
