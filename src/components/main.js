// Importar funções necessárias
import { convertCurrency } from './currencyConverter.js'; // Importa a função de conversão de moedas de um arquivo externo
import { fetchUniqueCurrencies } from './currencyFetcher.js'; // Importa a função para buscar moedas únicas de um arquivo externo

// Função para converter e exibir o resultado
async function converter() {
    try {
        // Obtém os valores dos elementos HTML com IDs específicos
        const moedaNaoConvertida = document.getElementById("moedaNaoConvertida").value; // Obtém o valor da moeda de origem
        const moedaConvertida = document.getElementById("moedaConvertida").value; // Obtém o valor da moeda de destino
        const valor = parseFloat(document.getElementById("valor").value); // Obtém o valor a ser convertido e o transforma em número

        // Verifica se o valor é um número válido
        if (isNaN(valor)) {
            throw new Error('O valor deve ser um número válido.'); // Lança um erro se o valor não for um número
        }

        // Chama a função de conversão de moedas com os parâmetros obtidos
        const result = await convertCurrency(moedaNaoConvertida, moedaConvertida, valor);

        // Verifica se o resultado é válido e exibe o resultado no console
        if (result) {
            console.log(`Converteu ${result.amount} ${result.from} para ${result.convertedAmount} ${result.to} com a taxa de câmbio de ${result.rate}`);
        } else {
            console.log('Erro ao realizar a conversão.'); // Exibe uma mensagem de erro se a conversão falhar
        }
    } catch (error) {
        console.error('Erro ao converter moeda:', error); // Captura e exibe qualquer erro que ocorra durante a conversão
    }
}

// Função principal para inicializar o select com moedas únicas
async function main() {
    try {
        // Obtém referências aos elementos select no HTML
        const moedaConvertida = document.getElementById('moedaConvertida'); // Select para a moeda de destino
        const moedaNaoConvertida = document.getElementById('moedaNaoConvertida'); // Select para a moeda de origem

        // Chama a função para buscar as moedas únicas e seus nomes
        const { uniqueCurrencies, uniqueCurrenciesName } = await fetchUniqueCurrencies();
        console.log(uniqueCurrencies, uniqueCurrenciesName); // Exibe no console as moedas e seus nomes

        // Verifica se os dados retornados são arrays válidos
        if (Array.isArray(uniqueCurrencies) && Array.isArray(uniqueCurrenciesName)) {
            // Itera sobre o array de moedas para criar opções nos selects
            uniqueCurrencies.forEach((currency, index) => {
                const optionElement = document.createElement('option'); // Cria um elemento option
                optionElement.value = currency; // Define o valor da opção como o código da moeda
                optionElement.textContent = uniqueCurrenciesName[index] + `(${currency})`; // Define o texto da opção com o nome e código da moeda
                moedaNaoConvertida.appendChild(optionElement.cloneNode(true)); // Adiciona a opção ao select de moeda de origem
                moedaConvertida.appendChild(optionElement.cloneNode(true)); // Adiciona a opção ao select de moeda de destino
            });
        } else {
            console.error('Não foi possível obter moedas únicas.'); // Exibe um erro se as moedas não puderem ser obtidas
        }
    } catch (error) {
        console.error('Erro ao obter moedas:', error); // Captura e exibe qualquer erro que ocorra durante a obtenção das moedas
    }
}

// Inicializar o script
main(); // Chama a função principal para inicializar os selects ao carregar a página

// Definir a função converter no escopo global para que possa ser acessada pelo HTML
window.converter = converter; // Torna a função de conversão acessível globalmente para ser chamada a partir de um evento no HTML
