function calculateIncomeTax(monthlySalary, dependents) {
    // Based on 2024 simplified tax table
    const taxTable = {
        1: [0,0,0,0,0,0,0,1630,6210,14360,24360,36240,50240,77240,105240,134240,163240,203240,243240,283240,323240,363240,403240,448240,493240,538240,583240,628240,673240,718240,763240,808240,853240,898240,943240,988240,1033240,1078240,1123240,1168240,1213240,1258240,1303240,1348240,1393240,1438240,1483240,1528240,1573240,1618240,1663240,1708240,1753240,1798240,1843240,1888240],
        2: [0,0,0,0,0,0,0,0,0,2980,10690,20690,32810,57810,83810,110810,137810,175310,212810,250310,287810,325310,362810,405310,447810,490310,532810,575310,617810,660310,702810,745310,787810,830310,872810,915310,957810,1000310,1042810,1085310,1127810,1170310,1212810,1255310,1297810,1340310,1382810,1425310,1467810,1510310,1552810,1595310,1637810,1680310,1722810,1765310],
        3: [0,0,0,0,0,0,0,0,0,0,4450,15070,38070,62070,87070,112070,147070,182070,217070,252070,287070,322070,362070,402070,442070,482070,522070,562070,602070,642070,682070,722070,762070,802070,842070,882070,922070,962070,1002070,1042070,1082070,1122070,1162070,1202070,1242070,1282070,1322070,1362070,1402070,1442070,1482070,1522070,1562070,1602070,1642070,1682070]
    };
    const salaryIndex = Math.floor(monthlySalary / 200000) - 7;
    const d = Math.max(1, Math.min(dependents, 11));
    const selectedTaxTable = taxTable[Math.min(d, 3)];
    if (monthlySalary < 1400000 || salaryIndex < 0 || salaryIndex >= selectedTaxTable.length) {
        if (monthlySalary > 8000000) { let tax = (monthlySalary * 0.24) - (d * 50000) - 520000; return Math.max(0, Math.floor(tax / 10) * 10); }
        return 0;
    }
    return selectedTaxTable[salaryIndex] || 0;
}

exports.handler = async function(event, context) {
    try {
        const { annualSalary, severancePay, dependents, childrenUnder20 } = JSON.parse(event.body);

        if (annualSalary <= 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Annual salary must be positive' }),
            };
        }

        const monthlySalary = Math.round(annualSalary / (severancePay === 'include' ? 13 : 12));
        const pensionCap = 5900000;
        const monthlyPensionBase = Math.min(monthlySalary, pensionCap);
        const nationalPension = Math.floor(monthlyPensionBase * 0.045 / 10) * 10;
        const healthInsurance = Math.floor(monthlySalary * 0.03545 / 10) * 10;
        const longTermCare = Math.floor(healthInsurance * 0.1295 / 10) * 10;
        const employmentInsurance = Math.floor(monthlySalary * 0.009 / 10) * 10;
        const totalDependents = dependents + childrenUnder20;
        const incomeTax = calculateIncomeTax(monthlySalary, totalDependents);
        const localTax = Math.floor(incomeTax * 0.1 / 10) * 10;

        const totalDeductions = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localTax;
        const netIncome = monthlySalary - totalDeductions;

        return {
            statusCode: 200,
            body: JSON.stringify({
                netIncome,
                monthlySalary,
                totalDeductions,
                nationalPension,
                healthInsurance,
                longTermCare,
                employmentInsurance,
                incomeTax,
                localTax
            }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate salary' }),
        };
    }
};