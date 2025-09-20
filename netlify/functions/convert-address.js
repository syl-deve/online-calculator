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

        // 1. 한글 주소 검색 API 호출 (도로명, 지번 주소 확보)
        const searchUrl = `https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=5&keyword=${encodeURIComponent(keyword)}&confmKey=${apiKey}&resultType=json`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.results || !searchData.results.juso || searchData.results.juso.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: '주소를 찾을 수 없습니다.' }) };
        }

        const firstResult = searchData.results.juso[0];
        const roadAddr = firstResult.roadAddr; // 도로명 주소
        const jibunAddr = firstResult.jibunAddr; // 지번 주소

        // 2. 영문 주소 변환 API 호출
        const engUrl = `https://www.juso.go.kr/addrlink/addrEngApi.do?keyword=${encodeURIComponent(roadAddr)}&confmKey=${apiKey}&resultType=json`;
        const engResponse = await fetch(engUrl);
        const engData = await engResponse.json();

        let engAddr = '영문 주소를 찾을 수 없습니다.';
        if (engData.results && engData.results.juso && engData.results.juso.length > 0) {
            engAddr = engData.results.juso[0].engAddr; // 영문 도로명 주소
        }

        // 3. 결과 반환
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
