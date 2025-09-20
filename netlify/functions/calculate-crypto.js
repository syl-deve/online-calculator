exports.handler = async function(event, context) {
    try {
        const { sourceAsset, sourceValue } = JSON.parse(event.body);
        const apiKey = process.env.COINGECKO_API_KEY;

        if (!apiKey) {
            throw new Error('API key is not configured on the server.');
        }

        const coin_ids = 'bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,cardano,the-open-network,avalanche-2,polkadot,tether,usd-coin';
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coin_ids}&vs_currencies=usd,krw&x_cg_demo_api_key=${apiKey}`;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`CoinGecko API responded with status: ${response.status}`);
        }

        const cryptoRates = await response.json();

        if (!cryptoRates.bitcoin || !cryptoRates.bitcoin.usd || !cryptoRates.bitcoin.krw) {
            throw new Error('Essential conversion rates (Bitcoin) are missing from API response.');
        }

        const btcToUsd = cryptoRates.bitcoin.usd;
        const btcToKrw = cryptoRates.bitcoin.krw;
        const usdToKrwRate = btcToKrw / btcToUsd;

        let valueInUsd = 0;

        if (isNaN(sourceValue) || sourceValue === '') {
             return {
                statusCode: 200,
                body: JSON.stringify({
                    rates: {},
                    btcPriceKrw: Math.round(btcToKrw)
                }),
            };
        }

        if (sourceAsset === 'KRW') {
            valueInUsd = sourceValue / usdToKrwRate;
        } else if (sourceAsset === 'USD') {
            valueInUsd = sourceValue;
        } else {
            if (cryptoRates[sourceAsset] && cryptoRates[sourceAsset].usd) {
                valueInUsd = sourceValue * cryptoRates[sourceAsset].usd;
            } else {
                 throw new Error(`Unsupported asset: ${sourceAsset}`);
            }
        }

        const results = {};
        const precisionMap = { KRW: 0, USD: 2, bitcoin: 8, ethereum: 8, solana: 4, binancecoin: 4, ripple: 4, dogecoin: 4, cardano: 4, 'the-open-network': 4, 'avalanche-2': 4, polkadot: 4, 'tether': 2, 'usd-coin': 2 };

        for (const assetId in cryptoRates) {
            if (cryptoRates[assetId] && cryptoRates[assetId].usd > 0) {
                const precision = precisionMap[assetId] ?? 2;
                results[assetId] = parseFloat((valueInUsd / cryptoRates[assetId].usd).toFixed(precision));
            }
        }

        results['KRW'] = Math.round(valueInUsd * usdToKrwRate);
        results['USD'] = parseFloat(valueInUsd.toFixed(2));

        return {
            statusCode: 200,
            body: JSON.stringify({
                rates: results,
                btcPriceKrw: Math.round(btcToKrw)
            }),
        };

    } catch (error) {
        console.error('Crypto calculation error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};