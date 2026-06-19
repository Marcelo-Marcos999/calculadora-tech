import React from 'react';

const CalculatorButton = ({ label, onClick }) => {
  return (
    <button className="calculator-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default CalculatorButton;
