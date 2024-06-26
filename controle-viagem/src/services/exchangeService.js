const BASE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

export const getExchangeRate = async (currencyFrom, currencyTo) => {
  try {
    const response = await fetch(`${BASE_API_URL}${currencyFrom}`);
    const data = await response.json();

    if (data.rates[currencyTo]) {
      return data.rates[currencyTo];
    } else {
      throw new Error('Invalid currency code');
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
};