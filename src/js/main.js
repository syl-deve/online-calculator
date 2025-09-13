document.addEventListener('DOMContentLoaded', function() {
    // --- Helper Functions ---
    const formatNumber = (num) => {
        if (num === null || num === undefined) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const unformatNumber = (str) => {
        if (str === null || str === undefined) return '';
        return str.toString().replace(/,/g, '');
    }

    function copyToClipboard(text, messageId) {
        if (!text || text === '0' || text.includes('0 원') || text.includes('D-Day') || text === '0.00 / 4.5' || text.includes('생년월일')) return;
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        const messageEl = document.getElementById(messageId);
        if (messageEl) {
            messageEl.classList.remove('hidden');
            setTimeout(() => {
                messageEl.classList.add('hidden');
            }, 1500);
        }
    }

    // --- Tab and Calculator Display Logic ---
    const allTabLinks = document.querySelectorAll('.tab-link-item');
    const desktopTitle = document.getElementById('currentCalculatorTitle');
    const calculatorTitles = {
        unitConverter: '데이터 단위', crypto: '주요 코인 환율', exchangeRate: '세계 환율', age: '만 나이', salary: '연봉 실수령액', commission: '부동산 중개보수', interest: '예/적금 이자', robux: '로벅스 환율', bmi: 'BMI (비만도)', dday: 'D-Day', loan: '대출 이자', gpa: '학점'
    };
    const calculators = {
        unitConverter: document.getElementById('unitConverterCalculator'), crypto: document.getElementById('cryptoCalculator'), exchangeRate: document.getElementById('exchangeRateCalculator'), age: document.getElementById('ageCalculator'), salary: document.getElementById('salaryCalculator'), commission: document.getElementById('commissionCalculator'), interest: document.getElementById('interestCalculator'), robux: document.getElementById('robuxCalculator'), bmi: document.getElementById('bmiCalculator'), dday: document.getElementById('ddayCalculator'), loan: document.getElementById('loanCalculator'), gpa: document.getElementById('gpaCalculator')
    };
    const infoSections = {
        unitConverter: document.getElementById('unitConverterInfo'), crypto: document.getElementById('cryptoInfo'), exchangeRate: document.getElementById('exchangeRateInfo'), age: document.getElementById('ageInfo'), salary: document.getElementById('salaryInfo'), commission: document.getElementById('commissionInfo'), interest: document.getElementById('interestInfo'), robux: document.getElementById('robuxInfo'), bmi: document.getElementById('bmiInfo'), dday: document.getElementById('ddayInfo'), loan: document.getElementById('loanInfo'), gpa: document.getElementById('gpaInfo')
    };

    function showTab(tabName) {
        const title = calculatorTitles[tabName] || '';
        if(desktopTitle) desktopTitle.textContent = title;
        
        Object.values(calculators).forEach(calc => calc && calc.classList.add('hidden'));
        Object.values(infoSections).forEach(info => info && info.classList.add('hidden'));
        
        if (calculators[tabName]) calculators[tabName].classList.remove('hidden');
        if (infoSections[tabName]) infoSections[tabName].classList.remove('hidden');
        
        // Handle active states for both desktop and mobile links
        document.querySelectorAll('aside .tab-link-item').forEach(link => {
            link.classList.remove('active-nav-link');
            if (link.dataset.tabLink === tabName) {
                link.classList.add('active-nav-link');
            }
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active-mobile-nav-link');
            if (link.dataset.tabLink === tabName) {
                link.classList.add('active-mobile-nav-link');
                // Scroll the active link into view on mobile
                link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }

    allTabLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const tabName = e.currentTarget.dataset.tabLink;
            window.location.hash = tabName;
            showTab(tabName);
        });
    });

    // --- Auto-formatting number inputs ---
    document.querySelectorAll('input[type="text"]').forEach(input => {
        const idsToFormat = ['cryptoKrw', 'krw', 'annualSalary', 'price', 'deposit', 'monthlyRent', 'principal', 'loanPrincipal', 'krwInputRobux', 'unitTb', 'unitGb', 'unitMb'];
        if(idsToFormat.includes(input.id)) {
            input.addEventListener('input', (e) => {
                const unformatted = unformatNumber(e.target.value);
                if (/^-?\d*\.?(d)*$/.test(unformatted) || unformatted === '') {
                    const parts = unformatted.split('.');
                    parts[0] = formatNumber(parts[0]);
                    e.target.value = parts.join('.');
                } else {
                     e.target.value = e.target.value.slice(0, -1);
                }
            });
        }
    });

    // --- General Reset Button Logic ---
    document.querySelectorAll('.reset-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const calculatorId = e.target.dataset.calculator;
            const form = document.getElementById(`${calculatorId}Calculator`);
            if (form) {
                form.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]').forEach(input => { input.value = ''; });
                // Reset specific result displays
                 if(calculatorId === 'age') {
                    document.getElementById('ageResultText').textContent = '0 세';
                    document.getElementById('ageResultDetails').textContent = '생년월일을 입력해주세요.';
                } else if (calculatorId === 'salary') {
                    document.getElementById('salaryResultNet').textContent = '0 원';
                    document.getElementById('salaryResultGross').textContent = '0 원';
                    document.getElementById('salaryResultDeductions').textContent = '0 원';
                }
                else if (calculatorId === 'commission') {
                    document.getElementById('commissionResultText').textContent = '0 원';
                    document.getElementById('commissionResultDetails').textContent = '계산 버튼을 눌러주세요.';
                }
                else if (calculatorId === 'interest') {
                    document.getElementById('interestResultTotal').textContent = '0 원';
                }
                else if (calculatorId === 'bmi') {
                    document.getElementById('bmiResultText').textContent = '0';
                    document.getElementById('bmiResultDetails').textContent = '값을 입력해주세요.';
                }
                else if (calculatorId === 'dday') {
                    document.getElementById('ddayResultText').textContent = 'D-Day';
                    document.getElementById('ddayResultDetails').textContent = '목표 날짜를 선택해주세요.';
                }
                else if (calculatorId === 'loan') {
                    document.getElementById('loanResultTotal').textContent = '0 원';
                }
            }
            if(calculatorId === 'gpa'){
                const container = document.getElementById('gpaRowsContainer');
                container.innerHTML = '';
                addGpaRow(); addGpaRow(); addGpaRow();
                document.getElementById('gpaResultText').textContent = '0.00 / 4.5';
                document.getElementById('gpaErrorText').textContent = '';
            }
        });
    });
    
    // --- SETUP ALL CALCULATORS ---
    
    // 1. Crypto Calculator
    function setupCryptoCalculator() {
        const cryptoInputs = document.querySelectorAll('.crypto-input');
        const cryptoRateInfoText = document.getElementById('cryptoRateInfoText');
        const cryptoInfoBox = document.getElementById('cryptoInfoBox');
        let cryptoRates = {};
        let isCryptoCalculating = false;

        async function fetchCryptoRates() {
            try {
                const coin_ids = 'bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,cardano,the-open-network,avalanche-2,polkadot,tether,usd-coin';
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin_ids}&vs_currencies=usd,krw`);
                if (!response.ok) throw new Error('Network response was not ok');
                cryptoRates = await response.json();
                const btcPriceKrw = formatNumber(Math.round(cryptoRates.bitcoin.krw));
                cryptoRateInfoText.textContent = `실시간 시세 적용 중 (예: 1 BTC = ${btcPriceKrw}원)`;
            } catch (error) {
                console.error("코인 시세 정보 가져오기 실패:", error);
                cryptoInfoBox.className = 'bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6';
                cryptoRateInfoText.innerHTML = `<p class="font-bold">오류</p><p>실시간 코인 시세 로딩에 실패했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>`;
                document.querySelectorAll('.crypto-input').forEach(input => {
                    input.disabled = true;
                    input.placeholder = '데이터 로딩 실패';
                    input.value = '';
                });
            }
        }

        function updateCryptoCalculations(sourceAsset) {
            if (isCryptoCalculating || Object.keys(cryptoRates).length === 0) return;
            isCryptoCalculating = true;

            const sourceInput = document.querySelector(`.crypto-input[data-asset="${sourceAsset}"]`);
            const sourceValue = parseFloat(unformatNumber(sourceInput.value));
            let valueInUsd = 0;
            
            const precisionMap = { KRW: 0, USD: 2, bitcoin: 8, ethereum: 8, solana: 4, binancecoin: 4, ripple: 4, dogecoin: 4, cardano: 4, 'the-open-network': 4, 'avalanche-2': 4, polkadot: 4, 'tether': 2, 'usd-coin': 2 };

            if (!isNaN(sourceValue) && sourceInput.value !== '') {
                if (sourceAsset === 'KRW') { valueInUsd = sourceValue / cryptoRates.bitcoin.krw * cryptoRates.bitcoin.usd; } 
                else if (sourceAsset === 'USD') { valueInUsd = sourceValue; } 
                else {
                    if (cryptoRates[sourceAsset]) { valueInUsd = sourceValue * cryptoRates[sourceAsset].usd; } 
                    else { isCryptoCalculating = false; return; }
                }

                cryptoInputs.forEach(input => {
                    const targetAsset = input.dataset.asset;
                    if (targetAsset !== sourceAsset) {
                        let targetValue;
                        if (targetAsset === 'KRW') { targetValue = valueInUsd / cryptoRates.bitcoin.usd * cryptoRates.bitcoin.krw; } 
                        else if (targetAsset === 'USD') { targetValue = valueInUsd; } 
                        else {
                            if (cryptoRates[targetAsset]) { targetValue = valueInUsd / cryptoRates[targetAsset].usd; } 
                            else { return; }
                        }

                        const precision = precisionMap[targetAsset] ?? 2;
                        if(targetAsset === 'KRW') {
                            input.value = formatNumber(Math.round(targetValue));
                        } else {
                            input.value = targetValue.toFixed(precision);
                        }
                    }
                });
            } else {
                cryptoInputs.forEach(input => { if (input !== sourceInput) input.value = ''; });
            }
            isCryptoCalculating = false;
        }
        
        cryptoInputs.forEach(input => {
            input.addEventListener('input', () => updateCryptoCalculations(input.dataset.asset));
        });
        
        fetchCryptoRates();
    }
    
    // 2. Exchange Rate Calculator
    function setupExchangeRateCalculator() {
        const currencyInputs = document.querySelectorAll('.currency-input');
        const exchangeRateInfoText = document.getElementById('exchangeRateInfoText');
        const exchangeRateInfoBox = document.getElementById('exchangeRateInfoBox');
        let exchangeRates = {};
        let isExchangeCalculating = false;

        async function fetchExchangeRates() {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/USD');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                exchangeRates = data.rates;
                exchangeRates['USD'] = 1;
                const krwRate = formatNumber(exchangeRates['KRW'].toFixed(2));
                const date = new Date(data.time_last_update_utc).toLocaleString('ko-KR');
                exchangeRateInfoText.textContent = `기준: 1달러 = ${krwRate}원 (업데이트: ${date})`;
            } catch (error) {
                console.error("환율 정보 가져오기 실패:", error);
                exchangeRateInfoBox.className = 'bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6';
                exchangeRateInfoText.innerHTML = `<p class="font-bold">오류</p><p>실시간 환율 정보 로딩에 실패했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>`;
                document.querySelectorAll('.currency-input').forEach(input => {
                    input.disabled = true;
                    input.placeholder = '데이터 로딩 실패';
                    input.value = '';
                });
            }
        }

        function updateExchangeCalculations(sourceCurrency) {
            if (isExchangeCalculating || Object.keys(exchangeRates).length === 0) return;
            isExchangeCalculating = true;

            const sourceInput = document.querySelector(`.currency-input[data-currency="${sourceCurrency}"]`);
            const sourceValue = parseFloat(unformatNumber(sourceInput.value));

            if (!isNaN(sourceValue) && sourceInput.value !== '') {
                const valueInUsd = sourceValue / exchangeRates[sourceCurrency];
                currencyInputs.forEach(input => {
                    const targetCurrency = input.dataset.currency;
                    if (targetCurrency !== sourceCurrency) {
                        const targetValue = valueInUsd * exchangeRates[targetCurrency];
                        if (targetCurrency === 'JPY') { input.value = Math.round(targetValue); } 
                        else if (targetCurrency === 'KRW') { input.value = formatNumber(targetValue.toFixed(0));}
                        else { input.value = targetValue.toFixed(2); }
                    }
                });
            } else {
                currencyInputs.forEach(input => { if (input !== sourceInput) input.value = ''; });
            }
            isExchangeCalculating = false;
        }

        currencyInputs.forEach(input => {
            input.addEventListener('input', () => updateExchangeCalculations(input.dataset.currency));
        });
        
        fetchExchangeRates();
    }
    
    // 3. Age Calculator
    function setupAgeCalculator() {
        document.getElementById('ageCalculateBtn').addEventListener('click', async () => {
            const birthDateInput = document.getElementById('birthDate');
            const ageResultText = document.getElementById('ageResultText');
            const ageResultDetails = document.getElementById('ageResultDetails');
            
            if (!birthDateInput.value) {
                ageResultDetails.textContent = "생년월일을 선택해주세요.";
                return;
            }

            ageResultDetails.textContent = '계산 중...';

            try {
                const response = await fetch('/.netlify/functions/calculate-age', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ birthDate: birthDateInput.value }),
                });

                if (!response.ok) {
                    throw new Error('서버에서 나이를 계산하는 데 실패했습니다.');
                }

                const data = await response.json();
                const today = new Date();
                ageResultText.textContent = `${data.age} 세`;
                ageResultDetails.textContent = `오늘 날짜: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

            } catch (error) {
                console.error('Age calculation error:', error);
                ageResultText.textContent = '-';
                ageResultDetails.textContent = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            }
        });
        document.getElementById('copyAgeBtn').addEventListener('click', () => copyToClipboard(document.getElementById('ageResultText').textContent, 'copyAgeMsg'));
    }

    // 4. Salary Calculator
    function setupSalaryCalculator() {
        const calculateBtn = document.getElementById('salaryCalculateBtn');
        calculateBtn.addEventListener('click', async () => {
            const annualSalary = Number(unformatNumber(document.getElementById('annualSalary').value));
            const severancePay = document.querySelector('input[name="severancePay"]:checked').value;
            let dependents = Number(document.getElementById('dependents').value);
            let childrenUnder20 = Number(document.getElementById('childrenUnder20').value);
            const errorText = document.getElementById('salaryErrorText');

            if (annualSalary <= 0) {
                errorText.textContent = "연봉을 정확히 입력해주세요.";
                return;
            }
            errorText.textContent = "";
            
            try {
                const response = await fetch('/.netlify/functions/calculate-salary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ annualSalary, severancePay, dependents, childrenUnder20 }),
                });

                if (!response.ok) {
                    throw new Error('Salary calculation failed on server.');
                }

                const data = await response.json();

                document.getElementById('salaryResultNet').textContent = `${formatNumber(data.netIncome)} 원`;
                document.getElementById('salaryResultGross').textContent = `${formatNumber(data.monthlySalary)} 원`;
                document.getElementById('salaryResultDeductions').textContent = `- ${formatNumber(data.totalDeductions)} 원`;
                document.getElementById('salaryDeductPension').textContent = `- ${formatNumber(data.nationalPension)} 원`;
                document.getElementById('salaryDeductHealth').textContent = `- ${formatNumber(data.healthInsurance)} 원`;
                document.getElementById('salaryDeductCare').textContent = `- ${formatNumber(data.longTermCare)} 원`;
                document.getElementById('salaryDeductEmployment').textContent = `- ${formatNumber(data.employmentInsurance)} 원`;
                document.getElementById('salaryDeductIncomeTax').textContent = `- ${formatNumber(data.incomeTax)} 원`;
                document.getElementById('salaryDeductLocalTax').textContent = `- ${formatNumber(data.localTax)} 원`;

            } catch (error) {
                console.error('Salary calculation error:', error);
                errorText.textContent = '계산 중 오류가 발생했습니다.';
            }
        });
        document.getElementById('copySalaryBtn').addEventListener('click', () => copyToClipboard(document.getElementById('salaryResultNet').textContent, 'copySalaryMsg'));
    }
    
    // 5. Commission Calculator
    function setupCommissionCalculator() {
        const tradeTypeContainer = document.getElementById('tradeTypeContainer');
        const priceContainer = document.getElementById('priceContainer');
        const rentContainer = document.getElementById('rentContainer');
        tradeTypeContainer.addEventListener('change', (e) => {
            if (e.target.name === 'tradeType') {
                if (e.target.value === '임대차') {
                    priceContainer.classList.add('hidden');
                    rentContainer.classList.remove('hidden');
                } else {
                    priceContainer.classList.remove('hidden');
                    rentContainer.classList.add('hidden');
                }
            }
        });

        document.getElementById('commissionCalculateBtn').addEventListener('click', async () => {
            const tradeType = document.querySelector('input[name="tradeType"]:checked').value;
            const propertyType = document.querySelector('input[name="propertyType"]:checked').value;
            const price = (tradeType === '매매') ? Number(unformatNumber(document.getElementById('price').value)) : Number(unformatNumber(document.getElementById('deposit').value));
            const monthlyRent = (tradeType === '매매') ? 0 : Number(unformatNumber(document.getElementById('monthlyRent').value));
            const errorText = document.getElementById('commissionErrorText');

            if ((tradeType === '매매' && price <= 0) || (tradeType === '임대차' && (price < 0 || monthlyRent < 0 || (price === 0 && monthlyRent === 0)))) {
                errorText.textContent = '금액을 정확히 입력해주세요.';
                return;
            }
            errorText.textContent = '';

            try {
                const response = await fetch('/.netlify/functions/calculate-commission', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tradeType, propertyType, price, monthlyRent }),
                });

                if (!response.ok) {
                    throw new Error('Commission calculation failed on server.');
                }

                const data = await response.json();

                document.getElementById('commissionResultText').textContent = `${formatNumber(data.finalFee)} 원`;
                let details = `적용 요율: ${(data.rate * 100).toFixed(2)}%`;
                if (data.limit !== Infinity) {
                    details += ` (한도액: ${formatNumber(data.limit)}원)`;
                }
                document.getElementById('commissionResultDetails').innerHTML = details + '<br>VAT 10%는 별도이며, 실제 보수는 협의를 통해 결정됩니다.';

            } catch (error) {
                console.error('Commission calculation error:', error);
                errorText.textContent = '계산 중 오류가 발생했습니다.';
            }
        });
        document.getElementById('copyCommissionBtn').addEventListener('click', () => copyToClipboard(document.getElementById('commissionResultText').textContent, 'copyCommissionMsg'));
    }
    
    // 6. Interest Calculator
    function setupInterestCalculator() {
        document.getElementById('interestCalculateBtn').addEventListener('click', async () => {
            const principal = Number(unformatNumber(document.getElementById('principal').value));
            const period = Number(document.getElementById('period').value);
            const annualRate = Number(document.getElementById('rate').value);
            const depositType = document.querySelector('input[name="depositType"]:checked').value;
            const taxType = document.querySelector('input[name="taxType"]:checked').value;
            const errorText = document.getElementById('interestErrorText');

            if (principal <= 0 || period <= 0 || annualRate <= 0) {
                errorText.textContent = "모든 값을 정확히 입력해주세요.";
                return;
            }
            errorText.textContent = "";

            try {
                const response = await fetch('/.netlify/functions/calculate-interest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ principal, period, annualRate, depositType, taxType }),
                });

                if (!response.ok) {
                    throw new Error('Interest calculation failed on server.');
                }

                const data = await response.json();

                document.getElementById('interestResultTotal').textContent = `${formatNumber(data.total)} 원`;
                document.getElementById('interestResultPrincipal').textContent = `${formatNumber(data.principal)} 원`;
                document.getElementById('interestResultBeforeTax').textContent = `${formatNumber(data.interestBeforeTax)} 원`;
                document.getElementById('interestResultTax').textContent = `- ${formatNumber(data.tax)} 원`;

            } catch (error) {
                console.error('Interest calculation error:', error);
                errorText.textContent = '계산 중 오류가 발생했습니다.';
            }
        });
        document.getElementById('copyInterestBtn').addEventListener('click', () => copyToClipboard(document.getElementById('interestResultTotal').textContent, 'copyInterestMsg'));
    }
    
    // 7. Robux Calculator
    function setupRobuxCalculator() {
         const robuxInput = document.getElementById('robuxInput'); 
        const krwInput_robux = document.getElementById('krwInputRobux'); 
        const usdInput_robux = document.getElementById('usdInput');
        const robuxRateInfo = document.getElementById('robuxRateInfo'); 
        const robuxInfoBox = document.getElementById('robuxInfoBox');
        const robuxStandardInfo = document.getElementById('robuxStandardInfo');
        const platformSelector = document.getElementById('platformSelector'); 
        const PC_KRW_PER_ROBUX = 15000 / 1200;
        const MOBILE_KRW_PER_ROBUX = 7500 / 400; 
        let currentKrwPerRobux = PC_KRW_PER_ROBUX;
        let robux_USD_TO_KRW = 1380; // Default
        let isRobuxCalculating = false;

        async function fetchRobuxRate() {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/USD'); if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json(); robux_USD_TO_KRW = data.rates.KRW;
                robuxRateInfo.textContent = `현재 환율 적용 중: 1달러 = ${robux_USD_TO_KRW.toFixed(2)}원`;
            } catch (error) { 
                console.error("환율 정보 가져오기 실패:", error); 
                robuxInfoBox.className = 'bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6';
                robuxRateInfo.textContent = `실시간 환율 로딩 실패. 예상 환율(1달러 = ${robux_USD_TO_KRW}원)을 기준으로 계산합니다.`; 
            }
        }
        
        function updateRobuxInfoText() {
            const selectedPlatform = platformSelector.querySelector('input[name="platform"]:checked').value;
            robuxStandardInfo.textContent = selectedPlatform === 'pc' ? '이 계산은 공식 PC/웹 구매가(1,200 R$ = 15,000원)를 기준으로 합니다.' : '이 계산은 공식 모바일 구매가(400 R$ = 7,500원)를 기준으로 합니다.';
        }
        
        platformSelector.addEventListener('change', (e) => {
            if (e.target.name === 'platform') {
                currentKrwPerRobux = e.target.value === 'pc' ? PC_KRW_PER_ROBUX : MOBILE_KRW_PER_ROBUX;
                updateRobuxInfoText();
                if (robuxInput.value) updateRobuxCalculations('robux');
                else if (krwInput_robux.value) updateRobuxCalculations('krw');
                else if (usdInput_robux.value) updateRobuxCalculations('usd');
            }
        });

        function updateRobuxCalculations(source) {
            if (isRobuxCalculating) return; isRobuxCalculating = true;
            const robux = parseFloat(robuxInput.value); const krw = parseFloat(unformatNumber(krwInput_robux.value)); const usd = parseFloat(usdInput_robux.value);
            if (source === 'robux') {
                if (!isNaN(robux) && robuxInput.value !== '') { const calculatedKrw = robux * currentKrwPerRobux; krwInput_robux.value = formatNumber(Math.round(calculatedKrw)); usdInput_robux.value = (calculatedKrw / robux_USD_TO_KRW).toFixed(2); } else { krwInput_robux.value = ''; usdInput_robux.value = ''; }
            } else if (source === 'krw') {
                if (!isNaN(krw) && krwInput_robux.value !== '') { robuxInput.value = Math.round(krw / currentKrwPerRobux); usdInput_robux.value = (krw / robux_USD_TO_KRW).toFixed(2); } else { robuxInput.value = ''; usdInput_robux.value = ''; }
            } else if (source === 'usd') {
                if (!isNaN(usd) && usdInput_robux.value !== '') { const calculatedKrw = usd * robux_USD_TO_KRW; krwInput_robux.value = formatNumber(Math.round(calculatedKrw)); robuxInput.value = Math.round(calculatedKrw / currentKrwPerRobux); } else { robuxInput.value = ''; krwInput_robux.value = ''; }
            }
            isRobuxCalculating = false;
        }
        
        robuxInput.addEventListener('input', () => updateRobuxCalculations('robux'));
        krwInput_robux.addEventListener('input', () => updateRobuxCalculations('krw'));
        usdInput_robux.addEventListener('input', () => updateRobuxCalculations('usd'));
        
        fetchRobuxRate().then(updateRobuxInfoText);
    }
    
    // 8. BMI Calculator
    function setupBmiCalculator() {
        document.getElementById('bmiCalculateBtn').addEventListener('click', async () => {
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const resultText = document.getElementById('bmiResultText');
            const resultDetails = document.getElementById('bmiResultDetails');

            if (height <= 0 || weight <= 0) {
                resultDetails.textContent = '키와 몸무게를 입력해주세요.';
                resultDetails.className = 'text-lg font-semibold text-blue-600';
                return;
            }

            try {
                const response = await fetch('/.netlify/functions/calculate-bmi', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ height, weight }),
                });

                if (!response.ok) {
                    throw new Error('BMI calculation failed on server.');
                }

                const data = await response.json();

                resultText.textContent = data.bmi;
                resultDetails.textContent = data.category;
                resultDetails.className = `text-lg font-semibold ${data.colorClass}`;

            } catch (error) {
                console.error('BMI calculation error:', error);
                resultText.textContent = '-';
                resultDetails.textContent = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                resultDetails.className = 'text-lg font-semibold text-red-600';
            }
        });
        document.getElementById('copyBmiBtn').addEventListener('click', () => copyToClipboard(document.getElementById('bmiResultText').textContent, 'copyBmiMsg'));
    }

    // 9. D-Day Calculator
    function setupDdayCalculator() {
        document.getElementById('ddayCalculateBtn').addEventListener('click', () => {
            const ddayDateInput = document.getElementById('ddayDate');
            const ddayResultText = document.getElementById('ddayResultText');
            const ddayResultDetails = document.getElementById('ddayResultDetails');
            if (!ddayDateInput.value) { ddayResultDetails.textContent = "목표 날짜를 선택해주세요."; return; }
            const targetDate = new Date(ddayDateInput.value);
            const today = new Date();
            today.setHours(0,0,0,0);
            targetDate.setHours(0,0,0,0);
            const diffTime = targetDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if(diffDays === 0) { ddayResultText.textContent = "D-Day"; }
            else if (diffDays > 0) { ddayResultText.textContent = `D-${diffDays}`; }
            else { ddayResultText.textContent = `D+${-diffDays}`; }
            ddayResultDetails.textContent = `${targetDate.getFullYear()}년 ${targetDate.getMonth()+1}월 ${targetDate.getDate()}일`;
        });
        document.getElementById('copyDdayBtn').addEventListener('click', () => copyToClipboard(document.getElementById('ddayResultText').textContent, 'copyDdayMsg'));
    }

    // 10. Loan Calculator
    function setupLoanCalculator() {
        document.getElementById('loanCalculateBtn').addEventListener('click', () => {
            const principal = parseFloat(unformatNumber(document.getElementById('loanPrincipal').value));
            const years = parseFloat(document.getElementById('loanPeriod').value);
            const annualRate = parseFloat(document.getElementById('loanRate').value);
            const errorText = document.getElementById('loanErrorText');
            if(principal > 0 && years > 0 && annualRate > 0) {
                errorText.textContent = "";
                const monthlyRate = annualRate / 100 / 12;
                const months = years * 12;
                const monthlyPayment = principal * monthlyRate * (Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
                const totalPayment = monthlyPayment * months;
                const totalInterest = totalPayment - principal;

                document.getElementById('loanResultTotal').textContent = `${formatNumber(Math.round(monthlyPayment))} 원`;
                document.getElementById('loanResultPrincipal').textContent = `${formatNumber(principal)} 원`;
                document.getElementById('loanResultInterest').textContent = `${formatNumber(Math.round(totalInterest))} 원`;
                document.getElementById('loanResultGrandTotal').textContent = `${formatNumber(Math.round(totalPayment))} 원`;
            } else {
                errorText.textContent = "모든 값을 정확히 입력해주세요.";
            }
        });
        document.getElementById('copyLoanBtn').addEventListener('click', () => copyToClipboard(document.getElementById('loanResultTotal').textContent, 'copyLoanMsg'));
    }
    
    // 11. GPA Calculator
    let addGpaRow;
    function setupGpaCalculator() {
        const container = document.getElementById('gpaRowsContainer');
        const addBtn = document.getElementById('addGpaRowBtn');
        const calcBtn = document.getElementById('gpaCalculateBtn');
        const resultText = document.getElementById('gpaResultText');
        const errorText = document.getElementById('gpaErrorText');
        
        const gradeMap = { 'A+': 4.5, 'A0': 4.0, 'B+': 3.5, 'B0': 3.0, 'C+': 2.5, 'C0': 2.0, 'D+': 1.5, 'D0': 1.0, 'F': 0.0 };

        addGpaRow = () => {
            const row = document.createElement('div');
            row.className = 'gpa-row grid grid-cols-12 gap-2 items-center mb-2';
            row.innerHTML = `
                <input type="text" placeholder="과목명" class="col-span-4 p-2 border rounded">
                <input type="number" placeholder="학점" class="col-span-2 p-2 border rounded gpa-credit">
                <select class="col-span-3 p-2 border rounded gpa-grade">
                    <option>A+</option><option>A0</option><option>B+</option><option>B0</option><option>C+</option><option>C0</option><option>D+</option><option>D0</option><option>F</option>
                </select>
                <div class="col-span-2 flex items-center justify-center">
                    <input type="checkbox" class="gpa-pf"> <label class="ml-1 text-sm">P/F</label>
                </div>
                <button class="col-span-1 remove-gpa-row text-red-500 hover:text-red-700 font-bold">X</button>
            `;
            container.appendChild(row);
        };

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-gpa-row')) {
                e.target.closest('.gpa-row').remove();
            }
        });
        
        addBtn.addEventListener('click', addGpaRow);
        
        calcBtn.addEventListener('click', () => {
            let totalCredits = 0;
            let totalPoints = 0;
            errorText.textContent = '';

            document.querySelectorAll('.gpa-row').forEach(row => {
                const credit = parseFloat(row.querySelector('.gpa-credit').value);
                const grade = row.querySelector('.gpa-grade').value;
                const isPf = row.querySelector('.gpa-pf').checked;

                if(!isNaN(credit) && credit > 0 && !isPf) {
                    totalCredits += credit;
                    totalPoints += credit * gradeMap[grade];
                }
            });

            if (totalCredits > 0) {
                const gpa = (totalPoints / totalCredits).toFixed(2);
                resultText.textContent = `${gpa} / 4.5`;
            } else {
                resultText.textContent = '0.00 / 4.5';
                errorText.textContent = '계산할 과목이 없습니다.';
            }
        });
        
        document.getElementById('copyGpaBtn').addEventListener('click', () => copyToClipboard(document.getElementById('gpaResultText').textContent, 'copyGpaMsg'));

        // Add initial rows
        addGpaRow(); addGpaRow(); addGpaRow();
    }
    
    // 12. Unit Converter
    function setupUnitConverter() {
        const unitInputs = document.querySelectorAll('.unit-input');
        let isUnitCalculating = false;

        const TB_TO_MB = 1024 * 1024;
        const GB_TO_MB = 1024;

        function updateUnitCalculations(sourceUnit) {
            if (isUnitCalculating) return;
            isUnitCalculating = true;

            const sourceInput = document.querySelector(`.unit-input[data-unit="${sourceUnit}"]`);
            const sourceValue = parseFloat(unformatNumber(sourceInput.value));

            if (!isNaN(sourceValue) && sourceInput.value !== '') {
                let valueInMb = 0;
                if (sourceUnit === 'TB') {
                    valueInMb = sourceValue * TB_TO_MB;
                } else if (sourceUnit === 'GB') {
                    valueInMb = sourceValue * GB_TO_MB;
                } else { // MB
                    valueInMb = sourceValue;
                }

                unitInputs.forEach(input => {
                    const targetUnit = input.dataset.unit;
                    if (targetUnit !== sourceUnit) {
                        let targetValue;
                        if (targetUnit === 'TB') {
                            targetValue = valueInMb / TB_TO_MB;
                        } else if (targetUnit === 'GB') {
                            targetValue = valueInMb / GB_TO_MB;
                        } else { // MB
                            targetValue = valueInMb;
                        }
                        
                        const parts = targetValue.toString().split('.');
                        parts[0] = formatNumber(parts[0]);
                        input.value = parts.join('.');
                    }
                });
            } else {
                // Clear all other inputs if the source is empty
                unitInputs.forEach(input => {
                    if (input !== sourceInput) {
                        input.value = '';
                    }
                });
            }
            isUnitCalculating = false;
        }

        unitInputs.forEach(input => {
            input.addEventListener('input', () => updateUnitCalculations(input.dataset.unit));
        });
    }

    // --- Mobile Nav Scroll ---
    function setupMobileNavScroll() {
        const navContainer = document.querySelector('.mobile-nav-container');
        const scrollLeftBtn = document.getElementById('scroll-left-btn');
        const scrollRightBtn = document.getElementById('scroll-right-btn');

        if (!navContainer || !scrollLeftBtn || !scrollRightBtn) return;

        const updateScrollButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = navContainer;
            // A small buffer is added to handle sub-pixel rendering issues
            const buffer = 1; 
            
            scrollLeftBtn.classList.toggle('hidden', scrollLeft <= 0);
            scrollRightBtn.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth - buffer);
        };

        scrollLeftBtn.addEventListener('click', () => {
            navContainer.scrollBy({ left: -200, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            navContainer.scrollBy({ left: 200, behavior: 'smooth' });
        });

        navContainer.addEventListener('scroll', updateScrollButtons);
        
        // Use ResizeObserver to detect size changes of the container
        new ResizeObserver(updateScrollButtons).observe(navContainer);
        
        // Initial check
        updateScrollButtons();
    }


    // --- INITIALIZE ---
    function initialize() {
        const initialTab = window.location.hash.substring(1) || 'unitConverter';
        
        setupUnitConverter();
        setupCryptoCalculator();
        setupExchangeRateCalculator();
        setupAgeCalculator();
        setupSalaryCalculator();
        setupCommissionCalculator();
        setupInterestCalculator();
        setupRobuxCalculator();
        setupBmiCalculator();
        setupDdayCalculator();
        setupLoanCalculator();
        setupGpaCalculator();
        setupMobileNavScroll();
        
        showTab(initialTab);
    }
    
    initialize();
});