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

  /**
   * Avalia a expressão sem lançar/logar erros — usado para o preview ao vivo.
   * Retorna `null` quando a expressão ainda é inválida/incompleta.
   */
  preview(expression) {
    try {
      return this.model.calculate(expression);
    } catch {
      return null;
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

  clearHistory() {
    try {
      this.model.clearHistory();
    } catch (error) {
      this.errorHandler.logError(error);
      throw this.errorHandler.throwError(error.message);
    }
  }
}

export default CalculatorService;
