import {
  COUNTRYS_API_LIST,
  CRYPTO_API_LIST,
  CONVERT_DOLARS_CRYPTO,
  API_KEY,
} from "./utils.js";

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
function getListOfCrypto() {
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
getListOfCountrys();
getListOfCrypto();

function addEventForm() {
  document
    .querySelector("#form-convert")
    .addEventListener("submit", submitEvent);
}

function formDataTraditionalToDolars() {
  return {
    from: document.querySelector("#sel-traditional-currency").value,
    to: document.querySelector("#sel-crypto-currency").value,
    amount: document.querySelector("#input-convert").value,
  };
}

function submitEvent(event) {
  event.preventDefault();
  console.log("submit event");
  const data = formDataTraditionalToDolars();
  converterAmountToDolar(
    data,
    fetchCurrencyToDolar(data, convertCryptoToDolar)
  );
}

function convertCryptoToDolar(data, convertValue, next) {
  console.log(convertValue, "one dolar");
  if (next !== null) next(data, convertValue);
}
// function currencyToDolar(value, convertValue) {
//   // console.log(convertValue.rates.USD.rate_for_amount);
//   // console.log(value);
//   console.log(convertValue.rates.USD.rate_for_amount);
// }

function converterAmountToDolar(data, next) {
  fetch(
    `https://api.getgeoapi.com/v2/currency/convert?${API_KEY}&from=${data.from}&to=USD&amount=${data.amount}`
  )
    .then((res) => res.json())
    .then((resDolars) => {
      next(data, resDolars, null);
    });
}
function fetchCurrencyToDolar(data, next) {
  fetch(`${CONVERT_DOLARS_CRYPTO}quote_currency_id=${data.to}&amount=${}`)
    .then((res) => res.json())
    .then((value) => {
      convertDolarToCrypto(data, value, null);
    });
}

addEventForm();

// document.querySelector("#form-convert").addEventListener("submit", (event) => {
//   event.preventDefault();

//   const convertTraditionalToDolars = {
//     from: document.querySelector("#sel-traditional-currency").value,
//     amount: document.querySelector("#input-convert").value,
//   };

//   fetch(
//     `https://api.getgeoapi.com/v2/currency/convert?${API_KEY}&from=${convertTraditionalToDolars.from}&to=USD&amount=${convertTraditionalToDolars.amount}`
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data.rates.USD.rate_for_amount, "traditional to dolars");
//     });

//   const quote_currency_id = document.querySelector(
//     "#sel-crypto-currency"
//   ).value;
//   fetch(
//     `${CONVERT_DOLARS_CRYPTO}quote_currency_id=${quote_currency_id}&amount=1`
//   )
//     .then((res) => res.json())
//     .then((crypto_converted) => {
//       console.log(crypto_converted.price,"dolars to crypto");
//     });
// });
