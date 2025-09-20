const moment = require('moment-timezone');

exports.handler = async (event) => {
    try {
        const { sourceTimezone, sourceDateTime } = JSON.parse(event.body);

        if (!sourceTimezone || !sourceDateTime) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: '소스 시간대와 시간이 필요합니다.' }),
            };
        }

        const targetTimezones = [
            { name: '서울', tz: 'Asia/Seoul' },
            { name: '뉴욕', tz: 'America/New_York' },
            { name: '런던', tz: 'Europe/London' },
            { name: '도쿄', tz: 'Asia/Tokyo' },
            { name: '상하이', tz: 'Asia/Shanghai' },
            { name: '시드니', tz: 'Australia/Sydney' },
            { name: '파리', tz: 'Europe/Paris' },
            { name: '로스앤젤레스', tz: 'America/Los_Angeles' },
            { name: '두바이', tz: 'Asia/Dubai' },
            { name: '모스크바', tz: 'Europe/Moscow' },
        ];

        const sourceMoment = moment.tz(sourceDateTime, sourceTimezone);

        const convertedTimes = targetTimezones.map(target => ({
            name: target.name,
            tz: target.tz,
            time: sourceMoment.clone().tz(target.tz).format('YYYY-MM-DD HH:mm:ss'),
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ convertedTimes }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: '시간 변환 중 오류가 발생했습니다.' }),
        };
    }
};