import React from 'react';

/**
 * Botão da calculadora.
 *
 * @param {string} label    Texto exibido no botão.
 * @param {Function} onClick Ação disparada ao clicar.
 * @param {string} variant  Estilo: default | action | operator | danger | memory | sci | equals.
 * @param {string} ariaLabel Rótulo acessível (fallback para o label).
 * @param {boolean} wide    Ocupa a largura total da grade.
 * @param {boolean} active  Estado visual "ligado" (ex.: memória preenchida).
 */
const CalculatorButton = ({ label, onClick, variant = 'default', ariaLabel, wide = false, active = false }) => {
  const classes = [
    'calc-btn',
    `calc-btn--${variant}`,
    wide ? 'calc-btn--wide' : '',
    active ? 'is-active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel || label}
      aria-pressed={active || undefined}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
