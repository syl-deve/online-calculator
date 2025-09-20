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

        // 주소 검색 API를 한번만 호출하여 모든 정보를 가져옵니다.
        const apiUrl = `https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=5&keyword=${encodeURIComponent(keyword)}&confmKey=${apiKey}&resultType=json`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.results || !data.results.juso || data.results.juso.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: '주소를 찾을 수 없습니다.' }) };
        }

        const firstResult = data.results.juso[0];
        
        const roadAddr = firstResult.roadAddr; // 도로명 주소
        const jibunAddr = firstResult.jibunAddr; // 지번 주소
        const engAddr = firstResult.engAddr || '영문 주소를 찾을 수 없습니다.'; // 영문 도로명 주소

        // 모든 결과를 한번에 반환합니다.
        return {
            statusCode: 200,
            body: JSON.stringify({ roadAddr, jibunAddr, engAddr }),
        };

    } catch (error) {
        console.error('Error in convert-address function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};