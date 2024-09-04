// currencyConverter.js

// Função assíncrona para converter moedas usando a AwesomeAPI
export async function convertCurrency(from, to, amount) {
    // URL da API que fornece a taxa de câmbio mais recente para as moedas especificadas
    const API_URL = `https://economia.awesomeapi.com.br/json/last/${from}-${to}`;

    try {
        // Faz uma requisição HTTP para a API
        const response = await fetch(API_URL);
        // Converte a resposta da API em um objeto JSON
        const data = await response.json();

        // Cria a chave para acessar o valor específico da conversão (formato: "FROMTO", ex: "USDBRL")
        const key = `${from}${to}`;
        // Obtém a taxa de câmbio (valor de compra) e a converte para um número de ponto flutuante
        const rate = parseFloat(data[key].bid);
        // Obtém os nomes completos das moedas envolvidas na conversão
        const nomeMoeda = Object.values(data).map(moeda => moeda.name);

        // Calcula o valor convertido multiplicando o valor original pela taxa de câmbio
        const convertedAmount = (rate * amount).toFixed(2); // Arredonda o valor convertido para 2 casas decimais

        // Retorna um objeto contendo as informações da conversão
        return {
            from,             // Moeda de origem
            to,               // Moeda de destino
            amount,           // Valor original a ser convertido
            convertedAmount,  // Valor convertido
            rate,             // Taxa de câmbio utilizada
            nomeMoeda,        // Nome completo das moedas envolvidas
        };
    } catch (error) {
        // Captura e exibe qualquer erro que ocorra durante o acesso à API
        console.error('Erro ao acessar a AwesomeAPI:', error);
        // Retorna `null` em caso de erro para indicar falha na conversão
        return null;
    }
}
