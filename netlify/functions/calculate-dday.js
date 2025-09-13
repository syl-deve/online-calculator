exports.handler = async function(event, context) {
    try {
        const { targetDateString } = JSON.parse(event.body);

        if (!targetDateString) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'targetDate is required' }),
            };
        }

        const targetDate = new Date(targetDateString);
        const today = new Date();
        today.setHours(0,0,0,0);
        targetDate.setHours(0,0,0,0);

        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            statusCode: 200,
            body: JSON.stringify({ diffDays }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate D-Day' }),
        };
    }
};