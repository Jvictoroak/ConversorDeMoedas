// currencyFetcher.js

// Função assíncrona para obter e listar moedas únicas
export async function fetchUniqueCurrencies() {
    const API_URL = 'https://economia.awesomeapi.com.br/json/available';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const uniqueCurrencies = new Set();
        const uniqueCurrenciesName = new Set();

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const [fromCurrency, toCurrency] = key.split('-', 2);
                uniqueCurrencies.add(fromCurrency);
                uniqueCurrencies.add(toCurrency);
            }
        }

        for (const nomeMoeda in data) {
            if (data.hasOwnProperty(nomeMoeda)) {
                const name = data[nomeMoeda];
                if (name) {
                    const [fromCurrencyName, toCurrencyNameWithExtra] = name.split('/', 2);
                    const toCurrencyName = toCurrencyNameWithExtra ? toCurrencyNameWithExtra.split('/')[0] : '';
                    if (fromCurrencyName && toCurrencyName) {
                        uniqueCurrenciesName.add(fromCurrencyName.trim());
                        uniqueCurrenciesName.add(toCurrencyName.trim());
                    } else {
                        console.warn(`O formato de nome da moeda está incorreto: ${name}`);
                    }
                } else {
                    console.warn(`'name' não encontrado para ${nomeMoeda}`);
                }
            }
        }
        return { uniqueCurrencies: Array.from(uniqueCurrencies), uniqueCurrenciesName: Array.from(uniqueCurrenciesName) };
    } catch (error) {
        console.error('Erro ao acessar a AwesomeAPI:', error);
        return { uniqueCurrencies: [], uniqueCurrenciesName: [] };
    }
}
