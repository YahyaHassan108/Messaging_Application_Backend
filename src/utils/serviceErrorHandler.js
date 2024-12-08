/**
 * Handles errors in service functions.
 * @param {Error} error - The error object to be handled.
 * @param {string} errorCode - A predefined error code to categorize the error.
 * @returns {Object} - An object containing the error code and message.
 */
export const handleServiceError = (error, errorCode) => {
    // Log the error details for debugging
    // console.error(`Error Code: ${errorCode} - ${error.message || error}`);

    // Throw an error that can be caught by the event handler
    throw new Error(error.message || 'An unexpected error occurred.');
};
