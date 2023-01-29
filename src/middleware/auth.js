/**
 * Removes the `password` and `__v` attributes from the MongoDB User document
 * and returns an object with the other relevant details.
 * @param {object} doc 
 * An object containing all the user's data from the database
 * @returns {object} 
 * An object containing all the user's data without `password` and `__v`.
 */
const getRelevantUserDetails = (doc) => {
    const { password, __v, ...otherDetails } = doc;
    return otherDetails;
};

module.exports = {
    getRelevantUserDetails,
};