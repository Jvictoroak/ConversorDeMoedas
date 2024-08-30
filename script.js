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

        const nomeMoeda = Object.values(data).map(moeda => moeda.name);

        // Calcula o valor convertido multiplicando a quantidade pela taxa de câmbio
        const convertedAmount = (rate * amount).toFixed(2); // Arredonda para duas casas decimais

        // Retorna um objeto com os detalhes da conversão
        return {
            from,               // Moeda de origem (ex: "USD")
            to,                 // Moeda de destino (ex: "BRL")
            amount,             // Quantidade de moeda de origem a ser convertida
            convertedAmount,    // Quantidade convertida para a moeda de destino
            rate,               // Taxa de câmbio usada para a conversão
            nomeMoeda,
        };
    } catch (error) {
        // Se houver um erro ao acessar a API, ele será capturado aqui
        console.error('Erro ao acessar a AwesomeAPI:', error);

        // Retorna null em caso de erro
        return null;
    }
}

// Função para converter e exibir o resultado
async function converter() {
    try {
        const moedaNaoConvertida = document.getElementById("moedaNaoConvertida").value;
        const moedaConvertida = document.getElementById("moedaConvertida").value;
        const valor = parseFloat(document.getElementById("valor").value);

        if (isNaN(valor)) {
            throw new Error('O valor deve ser um número válido.');
        }

        // Chama a função convertCurrency para converter o valor
        const result = await convertCurrency(moedaNaoConvertida, moedaConvertida, valor);

        // Verifica se a conversão foi bem-sucedida
        if (result) {
            // Se sim, imprime os detalhes da conversão no console
            console.log(`Converteu ${result.amount} ${result.from} para ${result.convertedAmount} ${result.to} com a taxa de câmbio de ${result.rate}`);
        } else {
            // Se não, imprime uma mensagem de erro
            console.log('Erro ao realizar a conversão.');
        }
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
    }
}

// Função assíncrona para obter e listar moedas únicas
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
        const uniqueCurrenciesName = new Set();

        // Itera sobre cada chave no objeto de dados
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // Extrai as moedas do par de moedas, por exemplo "USDBRL"
                const [fromCurrency, toCurrency] = key.split('-', 2)

                // Adiciona as moedas ao conjunto (o Set garante que sejam únicas)
                uniqueCurrencies.add(fromCurrency);
                uniqueCurrencies.add(toCurrency);
            }
        }
        for (const nomeMoeda in data) {
            if (data.hasOwnProperty(nomeMoeda)) {
                const name = data[nomeMoeda];
                // Verifique se a propriedade 'name' existe
                if (name) {
                    // Divide a string na primeira ocorrência da barra
                    const [fromCurrencyName, toCurrencyNameWithExtra] = name.split('/', 2);

                    // Limpa qualquer conteúdo após a primeira barra em toCurrencyName
                    const toCurrencyName = toCurrencyNameWithExtra ? toCurrencyNameWithExtra.split('/')[0] : '';

                    if (fromCurrencyName && toCurrencyName) {
                        // Adiciona as moedas ao conjunto (o Set garante que sejam únicas)
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
        // Retorna um objeto com os arrays de moedas únicas
        return { uniqueCurrencies: Array.from(uniqueCurrencies), uniqueCurrenciesName: Array.from(uniqueCurrenciesName) };
    } catch (error) {
        console.error('Erro ao acessar a AwesomeAPI:', error);
        return { uniqueCurrencies: [], uniqueCurrenciesName: [] }; // Retorna objetos vazios em caso de erro
    }
}
// Função principal para inicializar o select com moedas únicas
async function main() {
    try {
        // Obtém o elemento <select> pelo ID
        const moedaConvertida = document.getElementById('moedaConvertida');
        const moedaNaoConvertida = document.getElementById('moedaNaoConvertida');

        // Obtém o objeto contendo os arrays de moedas únicas
        const { uniqueCurrencies, uniqueCurrenciesName } = await fetchUniqueCurrencies();
        console.log(uniqueCurrencies, uniqueCurrenciesName); // Verifique os dados retornados

        // Verifica se os arrays de moedas únicas são válidos
        if (Array.isArray(uniqueCurrencies) && Array.isArray(uniqueCurrenciesName)) {
            // Itera sobre o array de moedas únicas
            uniqueCurrencies.forEach((currency, index) => {
                // Cria um novo elemento <option>
                const optionElement = document.createElement('option');
                optionElement.value = currency; // Define o valor da opção
                
                // Define o texto visível da opção com base em uniqueCurrenciesName
                // Verifique se index está dentro do intervalo de uniqueCurrenciesName
                optionElement.textContent = uniqueCurrenciesName[index] + `(${currency})`; // Use o nome correspondente ou o código se não houver nome

                // Adiciona a opção ao <select>
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