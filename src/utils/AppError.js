class AppError extends Error {
  /**
   *
   * @param {string} errorMessage - Error message
   * @param {number} statusCode - Http status code
   * @param {*} errors - errors array
   *
   */
  constructor(
    errorMessage = "Something went wrong",
    statusCode = 500,
    errors = null,
  ) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default AppError;
