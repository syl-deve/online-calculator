exports.handler = async function(event, context) {
    try {
        const { principal, period, annualRate, depositType, taxType } = JSON.parse(event.body);

        if (principal <= 0 || period <= 0 || annualRate <= 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input' }),
            };
        }

        const rate = annualRate / 100;
        let interestBeforeTax = (depositType === '단리') 
            ? principal * rate * (period / 12) 
            : principal * (Math.pow(1 + (rate / 12), period)) - principal;

        const tax = Math.floor(interestBeforeTax * (taxType === '일반' ? 0.154 : 0));
        const total = principal + interestBeforeTax - tax;

        return {
            statusCode: 200,
            body: JSON.stringify({
                total: Math.floor(total),
                principal,
                interestBeforeTax: Math.floor(interestBeforeTax),
                tax
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate interest' }),
        };
    }
};