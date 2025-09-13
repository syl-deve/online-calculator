exports.handler = async function(event, context) {
    try {
        const { robuxInput, krwInputRobux, usdInput, platform, source, robux_USD_TO_KRW } = JSON.parse(event.body);

        const PC_KRW_PER_ROBUX = 15000 / 1200;
        const MOBILE_KRW_PER_ROBUX = 7500 / 400;
        let currentKrwPerRobux = (platform === 'pc') ? PC_KRW_PER_ROBUX : MOBILE_KRW_PER_ROBUX;

        let robux = parseFloat(robuxInput);
        let krw = parseFloat(krwInputRobux);
        let usd = parseFloat(usdInput);

        if (source === 'robux') {
            if (!isNaN(robux)) {
                krw = robux * currentKrwPerRobux;
                usd = krw / robux_USD_TO_KRW;
            } else {
                robux = null; krw = null; usd = null;
            }
        } else if (source === 'krw') {
            if (!isNaN(krw)) {
                robux = krw / currentKrwPerRobux;
                usd = krw / robux_USD_TO_KRW;
            } else {
                robux = null; krw = null; usd = null;
            }
        } else if (source === 'usd') {
            if (!isNaN(usd)) {
                krw = usd * robux_USD_TO_KRW;
                robux = krw / currentKrwPerRobux;
            } else {
                robux = null; krw = null; usd = null;
            }
        } else {
            robux = null; krw = null; usd = null;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                robux: robux ? Math.round(robux) : null,
                krw: krw ? Math.round(krw) : null,
                usd: usd ? usd.toFixed(2) : null,
                robux_USD_TO_KRW: robux_USD_TO_KRW.toFixed(2) // Return the actual rate used
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate Robux' }),
        };
    }
};