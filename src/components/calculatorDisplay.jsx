import React from 'react';

/**
 * Display da calculadora: mostra a expressão em digitação e o resultado
 * (preview ao vivo ou resultado final). Usa aria-live para leitores de tela.
 */
const CalculatorDisplay = ({ expression, output, error, memory, copied }) => {
  return (
    <div className="calc-display" aria-live="polite">
      <div className="calc-display__meta">
        <span className={`calc-display__badge ${memory ? 'is-on' : ''}`} title="Valor em memória">
          M
        </span>
        {copied && <span className="calc-display__copied">Copiado!</span>}
      </div>

      <div className="calc-display__expression" title={expression}>
        {expression || '0'}
      </div>

      <div className={`calc-display__output ${error ? 'is-error' : ''}`}>
        {error ? error : output || '\u00A0'}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
