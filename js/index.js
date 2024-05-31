import {
  COUNTRYS_API_LIST,
  CRYPTO_API_LIST,
  CONVERT_DOLARS_CRYPTO,
  API_KEY,
  dolars,
  CONVERT_CRYPTO_DOLARS,
  CONVERT_GEOAPI,
} from "./utils.js";

let arrayHistoricalCurrency = [];
let arrayHistoricalCrypto = [];

let status = false;

let timer = "";

function formatDate(dateObj) {
  return dateObj.toISOString().split("T")[0];
}

function changeStatus() {
  status = !status;
  console.log(status === false ? "currency to crypto" : "crypto to currency");
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
eventChange();
animation();
endAnimation(timer);

function addEventForm() {
  document
    .querySelector("#form-convert")
    .addEventListener("submit", eventSubmitForm);
}

function eventChange() {
  let buttonChange = document.querySelector("#btn-change");
  buttonChange.addEventListener("click", changeStatus);
}

function animation() {
  let buttonChange = document.querySelector("#btn-change");
  buttonChange.addEventListener("mouseover", (event) => {
    buttonChange.classList.add("fa-spin");
  });
}

function endAnimation() {
  let buttonChange = document.querySelector("#btn-change");
  buttonChange.classList.remove("fa-spin");
  timer = setTimeout(endAnimation, 4000);
  animation();
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
  if (status === false) {
    convertCurrencyToCrypto(data);
    getListCurrencyToCrypto(data);
    getGraphicCurrencyToCrypto(
      data,
      arrayHistoricalCurrency,
      arrayHistoricalCrypto
    );
  } else {
    convertCryptoToCurrency(data);
    getListOfCurrency(data);
    getGraphicCurrency(data, arrayHistoricalCurrency);
  }
}

function convertCurrencyToCrypto(data) {
  fetch(`${CONVERT_GEOAPI}&from=${data.from}&to=USD&amount=${data.amount}`)
    .then((res) => res.json())
    .then((resAmount) => {
      console.log(resAmount, "amount");
      const convertDolarsToCrypto = {
        quote_currency_id: document.querySelector("#sel-crypto-currency").value,
        amount: resAmount.rates.USD.rate_for_amount,
      };
      fetch(
        `${CONVERT_DOLARS_CRYPTO}quote_currency_id=${convertDolarsToCrypto.quote_currency_id}&amount=${convertDolarsToCrypto.amount}`
      )
        .then((res) => res.json())
        .then((crypto_converted) => {
          const price = crypto_converted.price.toFixed(5);
          document.querySelector(
            "#price-result"
          ).innerHTML = `<h2 class="result">${data.amount} ${data.from} = <span class="priceCrypto">${price}</span> ${data.to}</h2>`;
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

function convertCryptoToCurrency(data) {
  fetch(
    `${CONVERT_CRYPTO_DOLARS}${data.to}&quote_currency_id=${dolars}&amount=${data.amount}`
  )
    .then((res) => res.json())
    .then((resCrypto) => {
      const cryptoPrice = resCrypto.price;
      console.log(cryptoPrice);
      fetch(`${CONVERT_GEOAPI}&from=USD&to=${data.from}&amount=${cryptoPrice}`)
        .then((res) => res.json())
        .then((resAmount) => {
          console.log(resAmount, "final amount");
          const finalPrice = resAmount.rates[data.from].rate_for_amount;
          document.querySelector(
            "#price-result"
          ).innerHTML = `<h2 class="result">${data.amount} ${data.to} = <span class="priceCrypto">${finalPrice}</span> ${data.to}</h2>`;
        });
    });
}

function calcularFechaFinal(date) {
  const dateObj = new Date(date);

  dateObj.setDate(dateObj.getDate() - 7);
  console.log(dateObj, "dateObj");
  return formatDate(dateObj);
}

function getListCurrencyToCrypto(data) {
  const finalDate = calcularFechaFinal(data.date);
  console.log(finalDate, "finalDate");
  fetch(
    `https://api.frankfurter.app/${finalDate}..${data.date}?from=${data.from}&to=USD`
  )
    .then((res) => res.json())
    .then((resDate) => {
      console.log(resDate.rates, "resDate currency list");
      arrayHistoricalCrypto = resDate.rates;
      getGraphicCurrencyToCrypto(
        arrayHistoricalCrypto,
        arrayHistoricalCurrency
      );
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
      getGraphicCurrencyToCrypto(
        arrayHistoricalCurrency,
        arrayHistoricalCrypto
      );
    });
}

function getListOfCurrency(data) {
  const finalDate = calcularFechaFinal(data.date);
  console.log(finalDate, "finalDate");
  fetch(
    `https://api.frankfurter.app/${finalDate}..${data.date}?from=${data.from}&to=USD`
  )
    .then((res) => res.json())
    .then((resDate) => {
      console.log(resDate.rates, "resDate currency list");
      arrayHistoricalCurrency = resDate.rates;
      getGraphicCurrency(arrayHistoricalCurrency);
    });
}

let labelsCoins = [];
let labelDates = [];

function getGraphicCurrencyToCrypto(cryptos, currencies) {
  labelsCoins = [];
  labelDates = [];
  var valueOfCrypto = 0;
  console.log(cryptos, "cryptos");
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
function getGraphicCurrency(currencies) {
  labelsCoins = [];
  labelDates = [];
  for (const key in currencies) {
    if (currencies.hasOwnProperty(key)) {
      labelsCoins.push(key);
      labelDates.push(currencies[key]);
    }
  }

  console.log(labelsCoins, "dates");
  console.log(labelDates, "labels");

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
