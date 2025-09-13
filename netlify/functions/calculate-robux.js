const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { source, value, platform } = JSON.parse(event.body);

        // 환율 정보 가져오기
        let usdToKrwRate = 1380; // 기본값
        try {
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            if (response.ok) {
                const data = await response.json();
                usdToKrwRate = data.rates.KRW;
            }
        } catch (e) {
            console.error("Failed to fetch real-time exchange rate, using default.", e);
        }

        // 초기 환율 정보만 요청한 경우
        if (source === 'FETCH_RATE') {
            return {
                statusCode: 200,
                body: JSON.stringify({ usdToKrwRate })
            };
        }

        const PC_KRW_PER_ROBUX = 15000 / 1200;
        const MOBILE_KRW_PER_ROBUX = 7500 / 400;
        const currentKrwPerRobux = platform === 'pc' ? PC_KRW_PER_ROBUX : MOBILE_KRW_PER_ROBUX;

        let robux = 0, krw = 0, usd = 0;
        const numValue = parseFloat(value);

        if (isNaN(numValue) || value === '') {
            return { statusCode: 200, body: JSON.stringify({ robux: '', krw: '', usd: '' }) };
        }

        if (source === 'robux') {
            robux = numValue;
            krw = robux * currentKrwPerRobux;
            usd = krw / usdToKrwRate;
        } else if (source === 'krw') {
            krw = numValue;
            robux = krw / currentKrwPerRobux;
            usd = krw / usdToKrwRate;
        } else if (source === 'usd') {
            usd = numValue;
            krw = usd * usdToKrwRate;
            robux = krw / currentKrwPerRobux;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                robux: Math.round(robux),
                krw: Math.round(krw),
                usd: usd.toFixed(2),
                usdToKrwRate // 현재 적용된 환율 정보도 함께 전달
            }),
        };

    } catch (error) {
        console.error('Error in calculate-robux function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
