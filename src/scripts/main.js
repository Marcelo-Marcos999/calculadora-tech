import React from 'react';
import { ErrorHandler } from '../utils/errorHandler';
import { add, subtract, multiply, divide, isEven, isOdd, round, sqrt } from '../utils/math';
import Display from '../components/Display';
import Buttons from '../components/Buttons';

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      operation: '',
      firstNumber: 0,
      secondNumber: 0,
    };
  }

  handleNumberClick = (value) => {
    try {
      if (this.state.operation === '') {
        this.setState({ value: this.state.value * 10 + value });
      } else {
        this.setState({ secondNumber: this.state.secondNumber * 10 + value });
      }
    } catch (error) {
      ErrorHandler.handleUnknownError(error);
    }
  };

  handleOperationClick = (operation) => {
    try {
      if (this.state.operation === '') {
        this.setState({ operation, firstNumber: this.state.value });
        this.setState({ value: 0 });
      } else {
        const result = this.calculateResult();
        this.setState({ value: result });
        this.setState({ operation, firstNumber: result });
        this.setState({ secondNumber: 0 });
      }
    } catch (error) {
      ErrorHandler.handleUnknownError(error);
    }
  };

  calculateResult = () => {
    switch (this.state.operation) {
      case '+':
        return add(this.state.firstNumber, this.state.secondNumber);
      case '-':
        return subtract(this.state.firstNumber, this.state.secondNumber);
      case '*':
        return multiply(this.state.firstNumber, this.state.secondNumber);
      case '/':
        return divide(this.state.firstNumber, this.state.secondNumber);
      default:
        return 0;
    }
  };

  handleClearClick = () => {
    this.setState({ value: 0, operation: '', firstNumber: 0, secondNumber: 0 });
  };

  render() {
    return (
      <div>
        <Display value={round(this.state.value, 2)} />
        <Buttons
          onNumberClick={(value) => this.handleNumberClick(value)}
          onOperationClick={(operation) => this.handleOperationClick(operation)}
          onClearClick={() => this.handleClearClick()}
        />
      </div>
    );
  }
}

export default Calculator;
