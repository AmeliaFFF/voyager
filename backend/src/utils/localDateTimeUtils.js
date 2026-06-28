const localDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isValidLocalDateTime(value) {
    if (typeof value !== "string" || !localDateTimeRegex.test(value)) {
        return false;
    }

    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    const daysInMonth = [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    return (
        year >= 1900 &&
        year <= 2100 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= daysInMonth[month - 1] &&
        hour >= 0 &&
        hour <= 23 &&
        minute >= 0 &&
        minute <= 59
    );
}

function isStartBeforeOrEqualEnd(startDateTime, endDateTime) {
    return startDateTime.localeCompare(endDateTime) <= 0;
}

module.exports = {
    isStartBeforeOrEqualEnd,
    isValidLocalDateTime
};
