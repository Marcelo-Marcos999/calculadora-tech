import CalculatorModel from '../models/calculatorModel.js';
import ErrorHandler from '../utils/errorHandler.js';

class CalculatorService {
  constructor() {
    this.model = new CalculatorModel();
    this.errorHandler = new ErrorHandler();
  }

  calculate(expression) {
    try {
      const result = this.model.calculate(expression);
      return result;
    } catch (error) {
      this.errorHandler.logError(error);
      throw this.errorHandler.throwError(error.message);
    }
  }

  addHistory(item) {
    try {
      this.model.addHistory(item);
    } catch (error) {
      this.errorHandler.logError(error);
      throw this.errorHandler.throwError(error.message);
    }
  }

  getHistory() {
    try {
      return this.model.getHistory();
    } catch (error) {
      this.errorHandler.logError(error);
      throw this.errorHandler.throwError(error.message);
    }
  }
}

export default CalculatorService;
