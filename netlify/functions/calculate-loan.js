exports.handler = async function(event, context) {
    try {
        const { principal, years, annualRate } = JSON.parse(event.body);

        if (principal <= 0 || years <= 0 || annualRate <= 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input' }),
            };
        }

        const monthlyRate = annualRate / 100 / 12;
        const months = years * 12;
        const monthlyPayment = principal * monthlyRate * (Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = monthlyPayment * months;
        const totalInterest = totalPayment - principal;

        return {
            statusCode: 200,
            body: JSON.stringify({
                monthlyPayment: Math.round(monthlyPayment),
                principal,
                totalInterest: Math.round(totalInterest),
                totalPayment: Math.round(totalPayment)
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate loan' }),
        };
    }
};