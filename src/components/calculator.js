import React, { useState } from 'react';
import CalculatorDisplay from './calculatorDisplay';
import CalculatorButton from './calculatorButton';
import CalculatorService from '../services/calculatorService';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState('');

  const handleDigitClick = (digit) => {
    setExpression(expression + digit);
  };

  const handleOperatorClick = (operator) => {
    setExpression(expression + operator);
  };

  const handleClearClick = () => {
    setExpression('');
    setResult('');
  };

  const handleCalculateClick = () => {
    try {
      const result = CalculatorService.calculate(expression);
      setResult(result);
      CalculatorService.addHistory({ expression, result });
      setHistory(CalculatorService.getHistory());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="calculator">
      <CalculatorDisplay value={expression} />
      <div className="calculator-keys">
        <CalculatorButton label="7" onClick={() => handleDigitClick('7')} />
        <CalculatorButton label="8" onClick={() => handleDigitClick('8')} />
        <CalculatorButton label="9" onClick={() => handleDigitClick('9')} />
        <CalculatorButton label="/" onClick={() => handleOperatorClick('/')} />
        <CalculatorButton label="4" onClick={() => handleDigitClick('4')} />
        <CalculatorButton label="5" onClick={() => handleDigitClick('5')} />
        <CalculatorButton label="6" onClick={() => handleDigitClick('6')} />
        <CalculatorButton label="*" onClick={() => handleOperatorClick('*')} />
        <CalculatorButton label="1" onClick={() => handleDigitClick('1')} />
        <CalculatorButton label="2" onClick={() => handleDigitClick('2')} />
        <CalculatorButton label="3" onClick={() => handleDigitClick('3')} />
        <CalculatorButton label="-" onClick={() => handleOperatorClick('-')} />
        <CalculatorButton label="0" onClick={() => handleDigitClick('0')} />
        <CalculatorButton label="." onClick={() => handleDigitClick('.')} />
        <CalculatorButton label="=" onClick={handleCalculateClick} />
        <CalculatorButton label "+" onClick={() => handleOperatorClick('+')} />
        <CalculatorButton label="C" onClick={handleClearClick} />
      </div>
      <CalculatorDisplay value={result} />
      <div className="calculator-history">
        <h2>History:</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              {item.expression} = {item.result}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
