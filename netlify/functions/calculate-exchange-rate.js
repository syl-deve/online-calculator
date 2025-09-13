const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { sourceCurrency, sourceValue } = JSON.parse(event.body);

        // API 호출하여 환율 정보 가져오기
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates.');
        }
        const data = await response.json();
        const rates = data.rates;
        rates['USD'] = 1; // USD 기준이므로 1로 설정

        // 모든 통화에 대한 환율 정보 미리 가져오기
        if (sourceCurrency === 'FETCH_RATES') {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    rates: rates,
                    lastUpdated: data.time_last_update_utc
                }),
            };
        }
        
        if (typeof sourceValue !== 'number' || !sourceCurrency || !rates[sourceCurrency]) {
            return { statusCode: 400, body: 'Invalid input' };
        }

        // 입력된 통화를 기준으로 USD 가치 계산
        const valueInUsd = sourceValue / rates[sourceCurrency];

        // 모든 통화에 대한 환산 금액 계산
        const calculatedRates = {};
        for (const currency in rates) {
            calculatedRates[currency] = valueInUsd * rates[currency];
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                rates: calculatedRates,
                lastUpdated: data.time_last_update_utc
            }),
        };

    } catch (error) {
        console.error('Error in calculate-exchange-rate function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
