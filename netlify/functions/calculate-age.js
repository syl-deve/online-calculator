exports.handler = async function(event, context) {
    try {
        const { birthDate: birthDateString } = JSON.parse(event.body);

        if (!birthDateString) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'birthDate is required' }),
            };
        }

        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ age: age }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate age' }),
        };
    }
};