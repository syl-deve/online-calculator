exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { mode, value1, value2 } = JSON.parse(event.body);

        if (value1 === null || value2 === null || value1 === undefined || value2 === undefined) {
            return { statusCode: 400, body: JSON.stringify({ error: '입력값이 유효하지 않습니다.' }) };
        }

        let result;

        switch (mode) {
            // mode 1: value1의 value2%는 얼마?
            case 'percentOf':
                // ex: 100의 50%는? -> (50 / 100) * 100 = 50
                result = (value2 / 100) * value1;
                break;

            // mode 2: value1은 value2의 몇 %?
            case 'whatPercent':
                 if (value2 === 0) {
                    return { statusCode: 400, body: JSON.stringify({ error: '0으로 나눌 수 없습니다.' }) };
                }
                // ex: 10은 200의 몇 %? -> (10 / 200) * 100 = 5
                result = (value1 / value2) * 100;
                break;
            
            // mode 3: value1이 value2로 변하면 몇 % 증가/감소?
            case 'percentChange':
                if (value1 === 0) {
                    return { statusCode: 400, body: JSON.stringify({ error: '기존 값은 0이 될 수 없습니다.' }) };
                }
                // ex: 100이 150으로 변하면? -> ((150 - 100) / 100) * 100 = 50% 증가
                result = ((value2 - value1) / value1) * 100;
                break;

            default:
                return { statusCode: 400, body: JSON.stringify({ error: '알 수 없는 계산 유형입니다.' }) };
        }

        // Clean up result to have a max of 4 decimal places if needed
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(4));
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ result }),
        };

    } catch (error) {
        console.error('Error in calculate-percentage function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
