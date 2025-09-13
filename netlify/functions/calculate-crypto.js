exports.handler = async function(event, context) {
    try {
        const { sourceAsset, sourceValue } = JSON.parse(event.body);

        const coin_ids = 'bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,cardano,the-open-network,avalanche-2,polkadot,tether,usd-coin';
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin_ids}&vs_currencies=usd,krw`);

        if (!response.ok) {
            throw new Error('암호화폐 시세 정보를 가져오는 데 실패했습니다.');
        }

        const cryptoRates = await response.json();

        // API 응답에 bitcoin 데이터가 있는지 확인 (KRW <-> USD 변환 기준)
        if (!cryptoRates.bitcoin || !cryptoRates.bitcoin.usd || !cryptoRates.bitcoin.krw) {
            throw new Error('필수 변환 데이터(비트코인 시세)가 없습니다.');
        }

        const btcToUsd = cryptoRates.bitcoin.usd;
        const btcToKrw = cryptoRates.bitcoin.krw;
        const usdToKrwRate = btcToKrw / btcToUsd;

        let valueInUsd = 0;

        if (isNaN(sourceValue) || sourceValue === '') {
             return {
                statusCode: 200,
                body: JSON.stringify({ rates: {} }),
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
                 throw new Error(`지원되지 않는 자산입니다: ${sourceAsset}`);
            }
        }

        const results = {};
        const precisionMap = { KRW: 0, USD: 2, bitcoin: 8, ethereum: 8, solana: 4, binancecoin: 4, ripple: 4, dogecoin: 4, cardano: 4, 'the-open-network': 4, 'avalanche-2': 4, polkadot: 4, 'tether': 2, 'usd-coin': 2 };

        // 모든 암호화폐에 대한 USD 가치 계산
        for (const assetId in cryptoRates) {
            if (cryptoRates[assetId] && cryptoRates[assetId].usd > 0) {
                const precision = precisionMap[assetId] ?? 2;
                results[assetId] = parseFloat((valueInUsd / cryptoRates[assetId].usd).toFixed(precision));
            }
        }

        // KRW 및 USD 가치 추가
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