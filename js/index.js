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

const listCountrys = fetch(COUNTRYS_API_LIST)
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
const listCrypto = fetch(CRYPTO_API_LIST)
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

document.querySelector("#form-convert").addEventListener("submit", (event) => {
  event.preventDefault();

  const convertTraditionalToDolars = {
    from: document.querySelector("#sel-traditional-currency").value,
    amount: document.querySelector("#input-convert").value,
  };

  fetch(
    `https://api.getgeoapi.com/v2/currency/convert?${API_KEY}&from=${convertTraditionalToDolars.from}&to=USD&amount=${convertTraditionalToDolars.amount}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.rates.USD.rate_for_amount, "traditional to dolars");
      const convertDolarsToCrypto = {
        quote_currency_id: document.querySelector("#sel-crypto-currency").value,
        amount: data.rates.USD.rate_for_amount,
      };
      fetch(
        `${CONVERT_DOLARS_CRYPTO}quote_currency_id=${convertDolarsToCrypto.quote_currency_id}&amount=${convertDolarsToCrypto.amount}`
      )
        .then((res) => res.json())
        .then((crypto_converted) => {
          console.log(crypto_converted, "dolars to crypto");
          document.querySelector("#price-result").innerHTML = crypto_converted.price.toFixed(2);
        });
    });
});
