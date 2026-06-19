import console from 'console';

class ErrorHandler {
  logError(error) {
    console.error(error);
  }

  throwError(message) {
    if (typeof message !== 'string') {
      throw new Error('Error message must be a string');
    }
    throw new Error(message);
  }

  handleUncaughtError(error) {
    this.logError(error);
    this.throwError(error.message);
  }
}

export default ErrorHandler;
