// currencyConverter.js

// Função assíncrona para converter moedas usando a AwesomeAPI
export async function convertCurrency(from, to, amount) {
    const API_URL = `https://economia.awesomeapi.com.br/json/last/${from}-${to}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const key = `${from}${to}`;
        const rate = parseFloat(data[key].bid);
        const nomeMoeda = Object.values(data).map(moeda => moeda.name);

        const convertedAmount = (rate * amount).toFixed(2);

        return {
            from,
            to,
            amount,
            convertedAmount,
            rate,
            nomeMoeda,
        };
    } catch (error) {
        console.error('Erro ao acessar a AwesomeAPI:', error);
        return null;
    }
}
