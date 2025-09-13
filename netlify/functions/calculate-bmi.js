exports.handler = async function(event, context) {
    try {
        const { height, weight } = JSON.parse(event.body);

        if (height <= 0 || weight <= 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Height and weight must be positive' }),
            };
        }

        const bmi = weight / ((height / 100) ** 2);
        let category = '', colorClass = '';

        if (bmi < 18.5) { category = '저체중'; colorClass = 'text-blue-600'; }
        else if (bmi < 23) { category = '정상'; colorClass = 'text-green-600'; }
        else if (bmi < 25) { category = '과체중'; colorClass = 'text-yellow-600'; }
        else if (bmi < 30) { category = '1단계 비만'; colorClass = 'text-orange-600'; }
        else { category = '2단계 이상 비만'; colorClass = 'text-red-600'; }

        return {
            statusCode: 200,
            body: JSON.stringify({
                bmi: bmi.toFixed(2),
                category,
                colorClass
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate BMI' }),
        };
    }
};