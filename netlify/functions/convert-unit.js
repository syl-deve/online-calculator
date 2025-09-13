exports.handler = async function(event, context) {
    try {
        const { sourceUnit, sourceValue } = JSON.parse(event.body);

        if (isNaN(sourceValue) || sourceValue < 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input' }),
            };
        }

        const TB_TO_MB = 1024 * 1024;
        const GB_TO_MB = 1024;

        let valueInMb = 0;
        if (sourceUnit === 'TB') {
            valueInMb = sourceValue * TB_TO_MB;
        } else if (sourceUnit === 'GB') {
            valueInMb = sourceValue * GB_TO_MB;
        } else { // MB
            valueInMb = sourceValue;
        }

        const result = {
            TB: valueInMb / TB_TO_MB,
            GB: valueInMb / GB_TO_MB,
            MB: valueInMb
        };

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to convert unit' }),
        };
    }
};