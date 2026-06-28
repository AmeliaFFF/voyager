// Get the YYYY-MM-DD portion from either a string or a Date object.
const getDatePart = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    if (dateValue instanceof Date) {
        return dateValue.toISOString().slice(0, 10);
    }

    return String(dateValue).slice(0, 10);
};

// Change date format from YYYY-MM-DD or YYYY-MM-DDTHH:mm to DD Month YYYY.
const formatDate = (dateValue) => {
    const datePart = getDatePart(dateValue);

    if (!datePart) {
        return "";
    }

    const [year, month, day] = datePart.split("-");

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
};

// Change time format from HH:mm to h:mm am/pm.
const formatTime = (dateTimeString) => {
    if (!dateTimeString || !String(dateTimeString).includes("T")) {
        return "";
    }

    const timePart = String(dateTimeString).split("T")[1];
    const [hourValue, minute] = timePart.split(":").map(Number);

    const period = hourValue >= 12 ? "pm" : "am";
    const displayHour = hourValue % 12 || 12;

    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
};

module.exports = {
    formatDate,
    formatTime
};
