// Função assíncrona para converter moedas usando a AwesomeAPI
async function convertCurrency(from, to, amount) {
    // Monta a URL da API com base nas moedas de origem e destino
    const API_URL = `https://economia.awesomeapi.com.br/json/last/${from}-${to}`;

    try {
        // Faz uma requisição HTTP GET para a URL da API
        const response = await fetch(API_URL);

        // Converte a resposta da API para um objeto JavaScript (JSON)
        const data = await response.json();

        // A chave no objeto JSON é uma combinação das moedas de origem e destino (ex: "USDBRL")
        const key = `${from}${to}`;

        // Obtém a taxa de câmbio da resposta da API. "bid" representa o preço de venda da moeda de origem para a moeda de destino
        const rate = parseFloat(data[key].bid);

        // Calcula o valor convertido multiplicando a quantidade pela taxa de câmbio
        const convertedAmount = (rate * amount).toFixed(2); // Arredonda para duas casas decimais

        // Retorna um objeto com os detalhes da conversão
        return {
            from,               // Moeda de origem (ex: "USD")
            to,                 // Moeda de destino (ex: "BRL")
            amount,             // Quantidade de moeda de origem a ser convertida
            convertedAmount,    // Quantidade convertida para a moeda de destino
            rate,               // Taxa de câmbio usada para a conversão
        };
    } catch (error) {
        // Se houver um erro ao acessar a API, ele será capturado aqui
        console.error('Erro ao acessar a AwesomeAPI:', error);

        // Retorna null em caso de erro
        return null;
    }
}

// Exemplo de uso da função, executado imediatamente
function converter() {
    (async () => {
        moeda = document.getElementById("moeda").value
        moedaConvertida = document.getElementById("moedaConvertida").value
        valor = document.getElementById("valor").value
        // Chama a função convertCurrency para converter 100 USD para BRL
        const result = await convertCurrency(moeda, moedaConvertida, valor);
        // const result = await convertCurrency('USD', 'BRL', 100);

        // Verifica se a conversão foi bem-sucedida
        if (result) {
            // Se sim, imprime os detalhes da conversão no console
            console.log(`Converteu ${result.amount} ${result.from} para ${result.convertedAmount} ${result.to} com a taxa de câmbio de ${result.rate}`);
        } else {
            // Se não, imprime uma mensagem de erro
            console.log('Erro ao realizar a conversão.');
        }
    })();
}
async function fetchUniqueCurrencies() {
    // URL para obter pares de moedas disponíveis
    const API_URL = 'https://economia.awesomeapi.com.br/json/available';

    try {
        // Faz uma requisição para obter os dados das moedas
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Converte a resposta para JSON
        const data = await response.json();

        // Cria um conjunto para armazenar moedas únicas
        const uniqueCurrencies = new Set();

        // Itera sobre cada chave no objeto de dados
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // Extrai as moedas do par de moedas, por exemplo "USDBRL"
                const [fromCurrency, toCurrency] = key.match(/[A-Z]{3}/g);

                // Adiciona as moedas ao conjunto (o Set garante que sejam únicas)
                uniqueCurrencies.add(fromCurrency);
                uniqueCurrencies.add(toCurrency);
            }
        }

        // Converte o Set para um array e exibe as moedas únicas
        const uniqueCurrenciesArray = Array.from(uniqueCurrencies);
        console.log('Moedas únicas:', uniqueCurrenciesArray);

    } catch (error) {
        console.error('Erro ao acessar a AwesomeAPI:', error);
    }
}

// Chama a função para obter e listar as moedas únicas
fetchUniqueCurrencies();
