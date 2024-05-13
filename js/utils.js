export const imprimir = (elemento, contenido) => {
    document.querySelector(`#${elemento}`).innerHTML = contenido;
  };

export const API_KEY = 'api_key=fc0dd6ef112f9a24a546e36fb4929dcf609afad6'
export const COUNTRYS_API_LIST = `https://api.getgeoapi.com/v2/currency/list?${API_KEY}`
export const CRYPTO_API_LIST = 'https://api.coinpaprika.com/v1/coins';
export const CONVERT_DOLARS_CRYPTO = 'https://api.coinpaprika.com/v1/price-converter?base_currency_id=usd-us-dollars&'
// https://api.coinpaprika.com/v1/price-converter?base_currency_id=usd-us-dollars&quote_currency_id=btc-bitcoin&amount=1.08