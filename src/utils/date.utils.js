/**
 * Formats the given date into the following format MMM yyyy.
 * @param {Date} date the date that needs to be formatted
 * @returns {String} A formatted date string.
 */
const getUserAccountCreationDate = (date) => {
    const monthAbbrevs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
        'Nov', 'Dec'];
    const monthName = monthAbbrevs[date.getMonth()];
    return `${monthName} ${date.getFullYear()}`;
};

/**
 * Formats the given date into the following format: dd/MM/yyyy.
 * @param {Date} date the date that needs to be formatted
 * @returns {String} A formatted date string.
 */
const getFormattedDate = (date) => {
    const day = formatNumber(date.getDate());
    const month = formatNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Formats the given date into the following format: dd/MM/yyyy hh:mm:ss.
 * @param {Date} date the date that needs to be formatted
 * @returns {String} A formatted datetime string.
 */
const getFormattedDateTime = (date) => {
    const dateString = getFormattedDate(date);
    return `${dateString} ${date.toLocaleTimeString()}`;
};

/**
 * Adds a 0 in front of positive numbers less than 10.
 * @param {number} num The number that needs to be formatted (expected to be positive)
 * @returns A formatted string of the given number.
 */
const formatNumber = (num) => {
    return num < 10 && num > 0 ? `0${num}` : `${num}`;
};

module.exports = { 
    getUserAccountCreationDate, 
    getFormattedDate, 
    getFormattedDateTime, 
    formatNumber,
};