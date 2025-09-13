exports.handler = async function(event, context) {
    try {
        const { courses } = JSON.parse(event.body);

        const gradeMap = { 'A+': 4.5, 'A0': 4.0, 'B+': 3.5, 'B0': 3.0, 'C+': 2.5, 'C0': 2.0, 'D+': 1.5, 'D0': 1.0, 'F': 0.0 };

        let totalCredits = 0;
        let totalPoints = 0;

        courses.forEach(course => {
            const credit = parseFloat(course.credit);
            const grade = course.grade;
            const isPf = course.isPf;

            if (!isNaN(credit) && credit > 0 && !isPf) {
                totalCredits += credit;
                totalPoints += credit * gradeMap[grade];
            }
        });

        let gpa = '0.00';
        if (totalCredits > 0) {
            gpa = (totalPoints / totalCredits).toFixed(2);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ gpa }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate GPA' }),
        };
    }
};