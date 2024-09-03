// main.js
import { convertCurrency } from './currencyConverter.js';
import { fetchUniqueCurrencies } from './currencyFetcher.js';

// Função para converter e exibir o resultado
async function converter() {
    try {
        const moedaNaoConvertida = document.getElementById("moedaNaoConvertida").value;
        const moedaConvertida = document.getElementById("moedaConvertida").value;
        const valor = parseFloat(document.getElementById("valor").value);

        if (isNaN(valor)) {
            throw new Error('O valor deve ser um número válido.');
        }

        const result = await convertCurrency(moedaNaoConvertida, moedaConvertida, valor);

        if (result) {
            console.log(`Converteu ${result.amount} ${result.from} para ${result.convertedAmount} ${result.to} com a taxa de câmbio de ${result.rate}`);
        } else {
            console.log('Erro ao realizar a conversão.');
        }
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
    }
}

// Função principal para inicializar o select com moedas únicas
async function main() {
    try {
        const moedaConvertida = document.getElementById('moedaConvertida');
        const moedaNaoConvertida = document.getElementById('moedaNaoConvertida');

        const { uniqueCurrencies, uniqueCurrenciesName } = await fetchUniqueCurrencies();
        console.log(uniqueCurrencies, uniqueCurrenciesName);

        if (Array.isArray(uniqueCurrencies) && Array.isArray(uniqueCurrenciesName)) {
            uniqueCurrencies.forEach((currency, index) => {
                const optionElement = document.createElement('option');
                optionElement.value = currency;
                optionElement.textContent = uniqueCurrenciesName[index] + `(${currency})`;
                moedaNaoConvertida.appendChild(optionElement.cloneNode(true));
                moedaConvertida.appendChild(optionElement.cloneNode(true));
            });
        } else {
            console.error('Não foi possível obter moedas únicas.');
        }
    } catch (error) {
        console.error('Erro ao obter moedas:', error);
    }
}

// Chama a função principal
main();

// Adiciona um ouvinte de evento ao botão de conversão
document.getElementById("convertButton").addEventListener("click", converter);
