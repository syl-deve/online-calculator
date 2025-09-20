exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { buyPrice, sellPrice, quantity, commissionRate } = JSON.parse(event.body);

        const values = [buyPrice, sellPrice, quantity, commissionRate];
        if (values.some(v => v === null || v === undefined || v < 0)) {
            return { statusCode: 400, body: JSON.stringify({ error: '모든 입력값은 0 이상이어야 합니다.' }) };
        }
        if (quantity === 0) {
             return { statusCode: 400, body: JSON.stringify({ error: '수량은 0보다 커야 합니다.' }) };
        }

        const totalBuyAmount = buyPrice * quantity;
        const totalSellAmount = sellPrice * quantity;

        const commission = (totalBuyAmount + totalSellAmount) * (commissionRate / 100);
        
        // 2025년 기준, 국내 상장주식 매도 시 증권거래세는 0.18% 입니다.
        // 이 세율은 매도 금액에 대해서만 부과됩니다.
        const sellTax = totalSellAmount * 0.0018; 

        const totalDeductions = commission + sellTax;
        const profitOrLoss = totalSellAmount - totalBuyAmount - totalDeductions;
        const returnOnInvestment = totalBuyAmount > 0 ? (profitOrLoss / totalBuyAmount) * 100 : 0;

        return {
            statusCode: 200,
            body: JSON.stringify({
                totalBuyAmount: Math.round(totalBuyAmount),
                totalSellAmount: Math.round(totalSellAmount),
                profitOrLoss: Math.round(profitOrLoss),
                returnOnInvestment: parseFloat(returnOnInvestment.toFixed(2)),
                totalDeductions: Math.round(totalDeductions)
            }),
        };

    } catch (error) {
        console.error('Error in calculate-stock function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
