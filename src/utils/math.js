export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero não é permitida');
  }
  return a / b;
}

export function isEven(number) {
  return number % 2 === 0;
}

export function isOdd(number) {
  return number % 2 !== 0;
}

export function round(number, precision = 0) {
  return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function sqrt(number) {
  if (number < 0) {
    throw new Error('Raiz quadrada de números negativos não é permitida');
  }
  return Math.sqrt(number);
}
