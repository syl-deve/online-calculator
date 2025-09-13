exports.handler = async function(event, context) {
    try {
        const { sourceAsset, sourceValue } = JSON.parse(event.body);

        let cryptoRates = {};
        const coin_ids = 'bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,cardano,the-open-network,avalanche-2,polkadot,tether,usd-coin';

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin_ids}&vs_currencies=usd,krw`);
            if (!response.ok) throw new Error('Network response was not ok from CoinGecko');
            cryptoRates = await response.json();
        } catch (error) {
            console.error("CoinGecko API fetch failed:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch real-time crypto rates' }),
            };
        }

        let valueInUsd = 0;
        const precisionMap = { KRW: 0, USD: 2, bitcoin: 8, ethereum: 8, solana: 4, binancecoin: 4, ripple: 4, dogecoin: 4, cardano: 4, 'the-open-network': 4, 'avalanche-2': 4, polkadot: 4, 'tether': 2, 'usd-coin': 2 };

        if (!isNaN(sourceValue) && sourceValue !== '') {
            if (sourceAsset === 'KRW') { valueInUsd = sourceValue / cryptoRates.bitcoin.krw * cryptoRates.bitcoin.usd; } 
            else if (sourceAsset === 'USD') { valueInUsd = sourceValue; } 
            else {
                if (cryptoRates[sourceAsset]) { valueInUsd = sourceValue * cryptoRates[sourceAsset].usd; } 
                else { throw new Error('Invalid source asset'); }
            }

            const results = {};
            for (const asset of Object.keys(cryptoRates)) {
                let targetValue;
                if (asset === 'KRW') { targetValue = valueInUsd / cryptoRates.bitcoin.usd * cryptoRates.bitcoin.krw; } 
                else if (asset === 'USD') { targetValue = valueInUsd; } 
                else {
                    if (cryptoRates[asset]) { targetValue = valueInUsd / cryptoRates[asset].usd; } 
                    else { continue; } // Skip if rate not found
                }

                const precision = precisionMap[asset] ?? 2;
                if (asset === 'KRW') {
                    results[asset] = Math.round(targetValue);
                } else {
                    results[asset] = parseFloat(targetValue.toFixed(precision));
                }
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    rates: results,
                    btcPriceKrw: Math.round(cryptoRates.bitcoin.krw) // For info text
                }),
            };

        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ rates: {} }), // Return empty if input is empty
            };
        }

    } catch (error) {
        console.error('Crypto calculation error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate crypto values' }),
        };
    }
};