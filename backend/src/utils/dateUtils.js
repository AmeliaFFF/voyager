// Change date format from YYYY-MM-DD to DD Month YYYY.
const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

// Change time format from HH:MM:SS to h:mm am/pm.
const formatTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
};

module.exports = {
    formatDate,
    formatTime
};