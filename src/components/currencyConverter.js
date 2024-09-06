export async function convertCurrency(from, to, amount) {
    const API_URL = `https://economia.awesomeapi.com.br/json/last/${from}-${to}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Cria a chave para acessar o valor específico da conversão
        const key = `${from}${to}`;

        // Verifica se a chave existe no objeto retornado pela API
        if (data[key] && data[key].bid) {
            const rate = parseFloat(data[key].bid);
            const nomeMoeda = data[key].name;

            const convertedAmount = (rate * amount).toFixed(2);

            return {
                from,
                to,
                amount,
                convertedAmount,
                rate,
                nomeMoeda,
            };
        } else {
            alert('Dados da API não contêm a taxa de câmbio esperada.')
            throw new Error('Dados da API não contêm a taxa de câmbio esperada.');
            
        }
    } catch (error) {
        console.error('Erro ao acessar a AwesomeAPI:', error);
        return null;
    }
}

