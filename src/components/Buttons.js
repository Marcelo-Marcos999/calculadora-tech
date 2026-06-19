import React from 'react';
import { ErrorHandler } from '../utils/errorHandler';
import { divide, isEven, isOdd } from '../utils/math';

const Buttons = () => {
  const handleButtonClick = (value) => {
    try {
      if (isEven(value)) {
        console.log('Número par');
      } else if (isOdd(value)) {
        console.log('Número ímpar');
      } else {
        console.log('Número inválido');
      }
    } catch (error) {
      ErrorHandler.handleUnknownError(error);
    }
  };

  return (
    <div>
      <button onClick={() => handleButtonClick(10)}>Verificar paridade</button>
      <button onClick={() => handleButtonClick(11)}>Verificar paridade</button>
      <button onClick={() => handleButtonClick(12)}>Verificar paridade</button>
    </div>
  );
};

export default Buttons;
