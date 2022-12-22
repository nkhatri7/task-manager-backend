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
 * Adds a 0 in front of a number less than 10.
 * @param {number} num The number that needs to be formatted
 * @returns A formatted string of the given number.
 */
const formatNumber = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
};

module.exports = { getFormattedDate, getFormattedDateTime };