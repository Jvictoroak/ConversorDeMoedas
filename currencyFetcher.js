// currencyFetcher.js

// Função assíncrona para obter e listar moedas únicas
export async function fetchUniqueCurrencies() {
    // URL da API que fornece as moedas disponíveis
    const API_URL = 'https://economia.awesomeapi.com.br/json/available';

    try {
        // Faz uma requisição HTTP para a API
        const response = await fetch(API_URL);
        // Verifica se a resposta da API foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); // Lança um erro se a resposta não for bem-sucedida
        }
        // Converte a resposta em um objeto JSON
        const data = await response.json();

        // Cria conjuntos para armazenar moedas únicas
        const uniqueCurrencies = new Set();
        const uniqueCurrenciesName = new Set();

        // Itera sobre os dados recebidos para extrair as moedas
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // Divide a string de chave para obter as moedas de origem e destino
                const [fromCurrency, toCurrency] = key.split('-', 2);
                // Adiciona as moedas ao conjunto, garantindo que sejam únicas
                uniqueCurrencies.add(fromCurrency);
                uniqueCurrencies.add(toCurrency);
            }
        }

        // Itera novamente sobre os dados para obter os nomes das moedas
        for (const nomeMoeda in data) {
            if (data.hasOwnProperty(nomeMoeda)) {
                const name = data[nomeMoeda];
                if (name) {
                    // Divide o nome da moeda para separar origem e destino
                    const [fromCurrencyName, toCurrencyNameWithExtra] = name.split('/', 2);
                    // Trata casos onde o nome da moeda de destino contém informações adicionais
                    const toCurrencyName = toCurrencyNameWithExtra ? toCurrencyNameWithExtra.split('/')[0] : '';
                    if (fromCurrencyName && toCurrencyName) {
                        // Adiciona os nomes das moedas ao conjunto
                        uniqueCurrenciesName.add(fromCurrencyName.trim());
                        uniqueCurrenciesName.add(toCurrencyName.trim());
                    } else {
                        console.warn(`O formato de nome da moeda está incorreto: ${name}`); // Exibe um aviso se o nome da moeda não estiver no formato esperado
                    }
                } else {
                    console.warn(`'name' não encontrado para ${nomeMoeda}`); // Exibe um aviso se o nome da moeda não for encontrado
                }
            }
        }
        // Retorna as moedas e seus nomes como arrays
        return { uniqueCurrencies: Array.from(uniqueCurrencies), uniqueCurrenciesName: Array.from(uniqueCurrenciesName) };
    } catch (error) {
        console.error('Erro ao acessar a AwesomeAPI:', error); // Captura e exibe qualquer erro que ocorra durante o acesso à API
        return { uniqueCurrencies: [], uniqueCurrenciesName: [] }; // Retorna arrays vazios em caso de erro
    }
}
