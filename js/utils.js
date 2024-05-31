export const imprimir = (elemento, contenido) => {
    document.querySelector(`#${elemento}`).innerHTML = contenido;
  };

export const API_KEY = 'api_key=9219bd68551190b433474dac3c5574e7d04dbffd'
export const COUNTRYS_API_LIST = `https://api.getgeoapi.com/v2/currency/list?${API_KEY}`
export const CRYPTO_API_LIST = 'https://api.coinpaprika.com/v1/coins';
export const CONVERT_DOLARS_CRYPTO = 'https://api.coinpaprika.com/v1/price-converter?base_currency_id=usd-us-dollars&'
export const CONVERT_CRYPTO_DOLARS = 'https://api.coinpaprika.com/v1/price-converter?base_currency_id='
export const dolars = 'usd-us-dollars';
export const CONVERT_GEOAPI = `https://api.getgeoapi.com/v2/currency/convert?${API_KEY}`
// https://api.coinpaprika.com/v1/price-converter?base_currency_id=usd-us-dollars&quote_currency_id=btc-bitcoin&amount=1.08