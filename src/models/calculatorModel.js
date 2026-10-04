/**
 * Motor de cálculo da Calculadora Tech.
 *
 * Avalia expressões matemáticas com um parser/avaliador próprio (recursive
 * descent), SEM usar `eval`. Suporta precedência de operadores, parênteses,
 * decimais, números negativos, porcentagem, potência, raiz quadrada e funções
 * trigonométricas/logarítmicas.
 */

const HISTORY_KEY = 'calc_history';
const MAX_HISTORY = 50;

const OPERATOR_CHARS = '+-×÷*/^()%√−';

/** Normaliza símbolos "bonitos" para os operadores canônicos. */
function normalizeOperator(char) {
  if (char === '−') return '-';
  return char;
}

/** Converte a expressão em uma lista de tokens. */
function tokenize(input) {
  const source = String(input).replace(/\s+/g, '');
  const tokens = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (/[0-9.]/.test(char)) {
      let number = '';
      while (i < source.length && /[0-9.]/.test(source[i])) {
        number += source[i];
        i += 1;
      }
      if ((number.match(/\./g) || []).length > 1) {
        throw new Error('Número inválido');
      }
      tokens.push({ type: 'number', value: parseFloat(number) });
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let name = '';
      while (i < source.length && /[a-zA-Z]/.test(source[i])) {
        name += source[i];
        i += 1;
      }
      tokens.push({ type: 'func', value: name.toLowerCase() });
      continue;
    }

    if (OPERATOR_CHARS.includes(char)) {
      tokens.push({ type: 'op', value: normalizeOperator(char) });
      i += 1;
      continue;
    }

    throw new Error(`Caractere inválido: ${char}`);
  }

  return tokens;
}

function applyFunction(name, value) {
  switch (name) {
    case 'sin':
      return Math.sin(value);
    case 'cos':
      return Math.cos(value);
    case 'tan':
      return Math.tan(value);
    case 'log':
      if (value <= 0) throw new Error('Log de valor não positivo');
      return Math.log10(value);
    case 'sqrt':
      if (value < 0) throw new Error('Raiz de número negativo');
      return Math.sqrt(value);
    default:
      throw new Error(`Função desconhecida: ${name}`);
  }
}

/** Parser descendente recursivo. */
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos];
  }

  next() {
    const token = this.tokens[this.pos];
    this.pos += 1;
    return token;
  }

  parse() {
    if (this.tokens.length === 0) {
      throw new Error('Expressão vazia');
    }
    const value = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error('Expressão inválida');
    }
    return value;
  }

  parseExpression() {
    let value = this.parseTerm();
    while (this.peek() && this.peek().type === 'op' && (this.peek().value === '+' || this.peek().value === '-')) {
      const op = this.next().value;
      const rhs = this.parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  parseTerm() {
    let value = this.parseFactor();
    while (this.peek() && this.peek().type === 'op' && ['×', '÷', '*', '/'].includes(this.peek().value)) {
      const op = this.next().value;
      const rhs = this.parseFactor();
      if (op === '×' || op === '*') {
        value *= rhs;
      } else {
        if (rhs === 0) throw new Error('Divisão por zero');
        value /= rhs;
      }
    }
    return value;
  }

  parseFactor() {
    const value = this.parseUnary();
    if (this.peek() && this.peek().type === 'op' && this.peek().value === '^') {
      this.next();
      // Potência é associativa à direita: 2^3^2 = 2^(3^2).
      return Math.pow(value, this.parseFactor());
    }
    return value;
  }

  parseUnary() {
    const token = this.peek();
    if (token && token.type === 'op' && (token.value === '-' || token.value === '+')) {
      this.next();
      const value = this.parseUnary();
      return token.value === '-' ? -value : value;
    }
    return this.parsePostfix();
  }

  parsePostfix() {
    let value = this.parsePrimary();
    while (this.peek() && this.peek().type === 'op' && this.peek().value === '%') {
      this.next();
      value /= 100;
    }
    return value;
  }

  parsePrimary() {
    const token = this.next();
    if (!token) {
      throw new Error('Expressão incompleta');
    }

    if (token.type === 'number') {
      return token.value;
    }

    if (token.type === 'op' && token.value === '(') {
      const value = this.parseExpression();
      const close = this.next();
      if (!close || close.value !== ')') throw new Error('Parêntese não fechado');
      return value;
    }

    if (token.type === 'op' && token.value === '√') {
      const value = this.parseUnary();
      if (value < 0) throw new Error('Raiz de número negativo');
      return Math.sqrt(value);
    }

    if (token.type === 'func') {
      const open = this.next();
      if (!open || open.value !== '(') throw new Error('Função requer parênteses');
      const value = this.parseExpression();
      const close = this.next();
      if (!close || close.value !== ')') throw new Error('Parêntese não fechado');
      return applyFunction(token.value, value);
    }

    throw new Error('Expressão inválida');
  }
}

/** Arredonda para evitar erros de ponto flutuante (0.1 + 0.2 => 0.3). */
function roundResult(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Resultado inválido');
  }
  return parseFloat(value.toPrecision(12));
}

/** Formata um número para exibição, limitando a quantidade de dígitos. */
export function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';
  const rounded = parseFloat(value.toPrecision(12));
  const text = String(rounded);
  if (text.length <= 14) return text;
  return rounded.toExponential(8);
}

class CalculatorModel {
  constructor() {
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
    } catch {
      /* localStorage indisponível — ignora silenciosamente */
    }
  }

  calculate(expression) {
    if (typeof expression !== 'string' || expression.trim() === '') {
      throw new Error('Expressão vazia');
    }
    const tokens = tokenize(expression);
    const parser = new Parser(tokens);
    return roundResult(parser.parse());
  }

  addHistory(item) {
    let entry;
    if (item && typeof item === 'object') {
      entry = {
        expression: String(item.expression ?? ''),
        result: item.result,
      };
    } else if (typeof item === 'string' || typeof item === 'number') {
      entry = { expression: String(item), result: item };
    } else {
      throw new Error('Item de histórico inválido');
    }

    this.history.unshift(entry);
    if (this.history.length > MAX_HISTORY) {
      this.history.length = MAX_HISTORY;
    }
    this.saveHistory();
    return entry;
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }
}

export default CalculatorModel;
