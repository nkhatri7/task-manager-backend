const MONTH_ABBREVIATIONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
'Nov', 'Dec'];

/**
 * Formats the given date into the following format MMM yyyy.
 * @param {Date} date the date that needs to be formatted
 * @returns {string} A formatted date string.
 */
const getUserAccountCreationDate = (date) => {
    const monthName = MONTH_ABBREVIATIONS[date.getMonth()];
    return `${monthName} ${date.getFullYear()}`;
};

/**
 * Formats the given date into the following format: dd/MM/yyyy.
 * @param {Date} date the date that needs to be formatted
 * @returns {string} A formatted date string.
 */
const getFormattedDate = (date) => {
    const day = formatNumber(date.getDate());
    const month = formatNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Formats the given date into the following format: dd MMM yyyy hh:mm:ss AM/PM.
 * @param {Date} date the date that needs to be formatted
 * @returns {string} A formatted datetime string.
 */
const getFormattedDateTime = (date) => {
    const day = formatNumber(date.getDate());
    const monthName = MONTH_ABBREVIATIONS[date.getMonth()];
    const year = date.getFullYear();
    const timeString = getTimeString(date);
    return `${day} ${monthName} ${year} ${timeString}`;
};

/**
 * Formats the given datetime into the following format hh:mm:ss AM/PM (12 hour time).
 * @param {Date} date The date that needs to be formatted
 * @returns {string} A formatted time string.
 */
const getTimeString = (date) => {
    let hour = '';
    if (date.getHours() > 12) {
        hour = formatNumber(date.getHours() - 12);
    } else {
        hour = formatNumber(date.getHours());
    }
    const minute = formatNumber(date.getMinutes());
    const second = formatNumber(date.getSeconds());
    return `${hour}:${minute}:${second} ${date.getHours() > 12 ? 'PM' : 'AM'}`;
};

/**
 * Adds a 0 in front of positive numbers less than 10.
 * @param {number} num The number that needs to be formatted (expected to be positive)
 * @returns A formatted string of the given number.
 */
const formatNumber = (num) => {
    return num < 10 && num >= 0 ? `0${num}` : `${num}`;
};

module.exports = { 
    getUserAccountCreationDate, 
    getFormattedDate, 
    getFormattedDateTime, 
    formatNumber,
};