import mathOperations from '../utils/mathOperations.js';

class CalculatorModel {
  constructor() {
    this.history = [];
  }

  calculate(expression) {
    if (typeof expression !== 'string' || expression.trim() === '') {
      throw new Error('Expression must be a non-empty string');
    }

    try {
      const result = mathOperations.evaluate(expression);
      if (typeof result !== 'number') {
        throw new Error('Result must be a number');
      }
      return result;
    } catch (error) {
      throw new Error(`Error calculating expression: ${error.message}`);
    }
  }

  addHistory(item) {
    if (typeof item !== 'string' && typeof item !== 'number') {
      throw new Error('History item must be a string or a number');
    }
    this.history.push(item);
  }

  getHistory() {
    return [...this.history];
  }
}

export default CalculatorModel;
