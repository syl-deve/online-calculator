exports.handler = async function(event, context) {
    try {
        const { tradeType, propertyType, price, monthlyRent } = JSON.parse(event.body);

        if ((tradeType === '매매' && price <= 0) || (tradeType === '임대차' && (price < 0 || monthlyRent < 0 || (price === 0 && monthlyRent === 0)))) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input' }),
            };
        }

        let dealAmount = price;
        if (tradeType === '임대차') {
            const convertedPrice = price + (monthlyRent * 100);
            dealAmount = (convertedPrice < 50000000) ? price + (monthlyRent * 70) : convertedPrice;
        }

        let rate = 0;
        let limit = Infinity;

        if (propertyType === '주택') {
            if (tradeType === '매매') {
                if (dealAmount < 50000000) { rate = 0.006; limit = 250000; }
                else if (dealAmount < 200000000) { rate = 0.005; limit = 800000; }
                else if (dealAmount < 900000000) { rate = 0.004; }
                else if (dealAmount < 1200000000) { rate = 0.005; }
                else if (dealAmount < 1500000000) { rate = 0.006; }
                else { rate = 0.007; }
            } else { // 임대차
                if (dealAmount < 50000000) { rate = 0.005; limit = 200000; }
                else if (dealAmount < 100000000) { rate = 0.004; limit = 300000; }
                else if (dealAmount < 600000000) { rate = 0.003; }
                else if (dealAmount < 1200000000) { rate = 0.004; }
                else if (dealAmount < 1500000000) { rate = 0.005; }
                else { rate = 0.006; }
            }
        } else if (propertyType === '오피스텔') {
            rate = (tradeType === '매매') ? 0.005 : 0.004;
        } else {
            rate = 0.009;
        }

        const finalFee = Math.min(dealAmount * rate, limit);

        return {
            statusCode: 200,
            body: JSON.stringify({
                finalFee: Math.floor(finalFee),
                rate,
                limit
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate commission' }),
        };
    }
};