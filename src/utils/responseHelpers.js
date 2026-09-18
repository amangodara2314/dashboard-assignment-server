/** 
 * Helper function to create a success response
  @param {Object} res - The response object
  @param {Object} data - The data to be sent in the response
  @param {string} message - The message to be sent in the response
  @param {number} statusCode - The HTTP status code for the response
  @returns {Object} - The success response object
 */

const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    success: true,
    message,
    data,
  });
};

export default successResponse;
