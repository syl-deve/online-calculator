const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { keyword } = JSON.parse(event.body);
        const apiKey = process.env.JUSO_API_KEY;

        if (!keyword) {
            return { statusCode: 400, body: 'Bad Request: keyword is required.' };
        }

        const apiUrl = `https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=5&keyword=${encodeURIComponent(keyword)}&confmKey=${apiKey}&resultType=json`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error('Error in search-address function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
