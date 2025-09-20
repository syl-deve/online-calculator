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
        percentage: '퍼센트 계산기',
        unitConverter: '데이터 단위', 
        crypto: '주요 코인 환율', 
        exchangeRate: '세계 환율', 
        timezone: '세계 시간 변환',
        age: '만 나이', 
        salary: '연봉 실수령액', 
        stock: '주식 수익률', 
        commission: '부동산 중개보수', 
        interest: '예/적금 이자', 
        robux: '로벅스 환율', 
        bmi: 'BMI (비만도)', 
        dday: 'D-Day', 
        loan: '대출 이자', 
        gpa: '학점', 
        address: '우편번호 찾기', 
        addressConverter: '한/영 주소 변환기'
    };
    const calculators = {
        percentage: document.getElementById('percentageCalculator'),
        unitConverter: document.getElementById('unitConverterCalculator'), 
        crypto: document.getElementById('cryptoCalculator'), 
        exchangeRate: document.getElementById('exchangeRateCalculator'), 
        timezone: document.getElementById('timezoneCalculator'),
        age: document.getElementById('ageCalculator'), 
        salary: document.getElementById('salaryCalculator'), 
        stock: document.getElementById('stockCalculator'), 
        commission: document.getElementById('commissionCalculator'), 
        interest: document.getElementById('interestCalculator'), 
        robux: document.getElementById('robuxCalculator'), 
        bmi: document.getElementById('bmiCalculator'), 
        dday: document.getElementById('ddayCalculator'), 
        loan: document.getElementById('loanCalculator'), 
        gpa: document.getElementById('gpaCalculator'), 
        address: document.getElementById('addressCalculator'), 
        addressConverter: document.getElementById('addressConverterCalculator')
    };
    const infoSections = {
        percentage: document.getElementById('percentageInfo'),
        unitConverter: document.getElementById('unitConverterInfo'), 
        crypto: document.getElementById('cryptoInfo'), 
        exchangeRate: document.getElementById('exchangeRateInfo'), 
        timezone: document.getElementById('timezoneInfo'),
        age: document.getElementById('ageInfo'), 
        salary: document.getElementById('salaryInfo'), 
        stock: document.getElementById('stockInfo'), 
        commission: document.getElementById('commissionInfo'), 
        interest: document.getElementById('interestInfo'), 
        robux: document.getElementById('robuxInfo'), 
        bmi: document.getElementById('bmiInfo'), 
        dday: document.getElementById('ddayInfo'), 
        loan: document.getElementById('loanInfo'), 
        gpa: document.getElementById('gpaInfo'), 
        address: document.getElementById('addressInfo'), 
        addressConverter: document.getElementById('addressConverterInfo')
    };

    function showTab(tabName) {
        const title = calculatorTitles[tabName] || '';
        if(desktopTitle) desktopTitle.textContent = title;
        
        Object.values(calculators).forEach(calc => calc && calc.classList.add('hidden'));
        Object.values(infoSections).forEach(info => info && info.classList.add('hidden'));
        
        if (calculators[tabName]) calculators[tabName].classList.remove('hidden');
        if (infoSections[tabName]) infoSections[tabName].classList.remove('hidden');
        
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

    document.querySelectorAll('input[type="text"]').forEach(input => {
        const idsToFormat = ['cryptoKrw', 'krw', 'annualSalary', 'price', 'deposit', 'monthlyRent', 'principal', 'loanPrincipal', 'krwInputRobux', 'unitTb', 'unitGb', 'unitMb', 'buyPrice', 'sellPrice'];
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

    document.querySelectorAll('.reset-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const calculatorId = e.target.dataset.calculator;
            const form = document.getElementById(`${calculatorId}Calculator`);
            if (form) {
                form.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]').forEach(input => { input.value = ''; });
                if(calculatorId === 'age') {
                    document.getElementById('ageResultText').textContent = '0 세';
                    document.getElementById('ageResultDetails').textContent = '생년월일을 입력해주세요.';
                } else if (calculatorId === 'salary') {
                    document.getElementById('salaryResultNet').textContent = '0 원';
                    document.getElementById('salaryResultGross').textContent = '0 원';
                    document.getElementById('salaryResultDeductions').textContent = '0 원';
                } else if (calculatorId === 'stock') {
                    document.getElementById('stockResultProfit').textContent = '0 원';
                    document.getElementById('stockResultRoi').textContent = '0 %';
                    document.getElementById('stockResultBuyAmount').textContent = '0 원';
                    document.getElementById('stockResultSellAmount').textContent = '0 원';
                    document.getElementById('stockResultDeductions').textContent = '0 원';
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

    // 0. Percentage Calculator
    function setupPercentageCalculator() {
        const modeContainer = document.getElementById('percentageModeContainer');
        const inputsContainer = document.getElementById('percentageInputsContainer');
        const resultText = document.getElementById('percentageResultText');
        const errorText = document.getElementById('percentageErrorText');
        let currentMode = 'percentOf';

        const inputTemplates = {
            percentOf: `
                <div><label class="font-semibold text-gray-700">전체 값</label><input type="number" id="percentOf_value1" class="w-full p-3 border rounded-lg mt-1" placeholder="100,000"></div>
                <div><label class="font-semibold text-gray-700">비율 (%)</label><input type="number" id="percentOf_value2" class="w-full p-3 border rounded-lg mt-1" placeholder="5"></div>
            `,
            whatPercent: `
                <div><label class="font-semibold text-gray-700">일부 값</label><input type="number" id="whatPercent_value1" class="w-full p-3 border rounded-lg mt-1" placeholder="10"></div>
                <div><label class="font-semibold text-gray-700">전체 값</label><input type="number" id="whatPercent_value2" class="w-full p-3 border rounded-lg mt-1" placeholder="200"></div>
            `,
            percentChange: `
                <div><label class="font-semibold text-gray-700">이전 값</label><input type="number" id="percentChange_value1" class="w-full p-3 border rounded-lg mt-1" placeholder="100"></div>
                <div><label class="font-semibold text-gray-700">나중 값</label><input type="number" id="percentChange_value2" class="w-full p-3 border rounded-lg mt-1" placeholder="120"></div>
            `
        };

        function renderInputs(mode) {
            inputsContainer.innerHTML = inputTemplates[mode];
            resultText.textContent = '0';
            errorText.textContent = '';
            modeContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('border-blue-600', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-500');
                if (btn.dataset.mode === mode) {
                    btn.classList.add('border-blue-600', 'text-blue-600');
                }
            });
        }

        async function calculate() {
            const value1 = parseFloat(document.getElementById(`${currentMode}_value1`).value);
            const value2 = parseFloat(document.getElementById(`${currentMode}_value2`).value);

            if (isNaN(value1) || isNaN(value2)) {
                resultText.textContent = '0';
                errorText.textContent = '';
                return;
            }

            try {
                const response = await fetch('/.netlify/functions/calculate-percentage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mode: currentMode, value1, value2 })
                });

                const data = await response.json();

                if (response.status !== 200) {
                    throw new Error(data.error);
                }

                let finalResult = formatNumber(data.result);
                if (currentMode === 'whatPercent' || currentMode === 'percentChange') {
                    finalResult += ' %';
                }
                resultText.textContent = finalResult;
                errorText.textContent = '';

            } catch (err) {
                resultText.textContent = '-';
                errorText.textContent = err.message;
            }
        }

        modeContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                currentMode = e.target.dataset.mode;
                renderInputs(currentMode);
            }
        });

        inputsContainer.addEventListener('input', calculate);
        document.getElementById('copyPercentageBtn').addEventListener('click', () => copyToClipboard(resultText.textContent, 'copyPercentageMsg'));

        renderInputs(currentMode);
    }
    
    // ... (other calculator setups)

    // New Timezone Calculator Setup
    async function setupTimezoneCalculator() {
        const sourceZoneSelect = document.getElementById('sourceZone');
        const targetZoneSelect = document.getElementById('targetZone');
        const sourceTimeInput = document.getElementById('sourceTime');
        const resultText = document.getElementById('timezoneResultText');
        const errorText = document.getElementById('timezoneErrorText');

        async function convertTime() {
            const dateTime = sourceTimeInput.value;
            const sourceZone = sourceZoneSelect.value;
            const targetZone = targetZoneSelect.value;

            if (!dateTime || !sourceZone || !targetZone) {
                return;
            }

            try {
                const response = await fetch('/.netlify/functions/convert-timezone', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dateTime, sourceZone, targetZone })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                resultText.textContent = data.result;
                errorText.textContent = '';
            } catch (err) {
                resultText.textContent = '-';
                errorText.textContent = err.message;
            }
        }

        try {
            const response = await fetch('/.netlify/functions/convert-timezone');
            const timezones = await response.json();
            
            timezones.forEach(tz => {
                const option1 = new Option(tz.name, tz.value);
                const option2 = new Option(tz.name, tz.value);
                sourceZoneSelect.add(option1);
                targetZoneSelect.add(option2);
            });

            const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezones.some(tz => tz.value === localTimeZone)) {
                sourceZoneSelect.value = localTimeZone;
            }
            targetZoneSelect.value = 'America/New_York';

            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            sourceTimeInput.value = now.toISOString().slice(0,16);

            [sourceZoneSelect, targetZoneSelect, sourceTimeInput].forEach(el => {
                el.addEventListener('change', convertTime);
            });

            convertTime();

        } catch (error) {
            errorText.textContent = '시간대 정보를 불러오는 데 실패했습니다.';
        }
    }

    // --- INITIALIZE ---
    function initialize() {
        const initialTab = window.location.hash.substring(1) || 'percentage';
        
        setupPercentageCalculator();
        setupUnitConverter();
        setupCryptoCalculator();
        setupExchangeRateCalculator();
        setupTimezoneCalculator();
        setupAgeCalculator();
        setupSalaryCalculator();
        setupStockCalculator();
        setupCommissionCalculator();
        setupInterestCalculator();
        setupRobuxCalculator();
        setupBmiCalculator();
        setupDdayCalculator();
        setupLoanCalculator();
        setupGpaCalculator();
        setupAddressCalculator();
        setupAddressConverter();
        setupMobileNavScroll();
        
        showTab(initialTab);
    }
    
    initialize();
});