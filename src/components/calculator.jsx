import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CalculatorDisplay from './calculatorDisplay.jsx';
import CalculatorButton from './calculatorButton.jsx';
import CalculatorService from '../services/calculatorService.js';
import { formatNumber } from '../models/calculatorModel.js';

const service = new CalculatorService();

const THEME_KEY = 'calc_theme';
const MEMORY_KEY = 'calc_memory';

/** Tokens de função que devem ser apagados por inteiro no backspace. */
const FUNC_TOKENS = ['sin(', 'cos(', 'tan(', 'log(', '√('];

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState(() => service.getHistory());
  const [memory, setMemory] = useState(() => {
    const stored = parseFloat(localStorage.getItem(MEMORY_KEY));
    return Number.isFinite(stored) ? stored : 0;
  });
  const [scientific, setScientific] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);

  /* ----------------------------- persistência ----------------------------- */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(MEMORY_KEY, String(memory));
  }, [memory]);

  /* ------------------------------- preview -------------------------------- */
  const preview = useMemo(() => {
    if (!expression.trim()) return '';
    const value = service.preview(expression);
    return value === null ? '' : formatNumber(value);
  }, [expression]);

  const output = error || preview || result;

  /* ------------------------------- entradas ------------------------------- */
  const append = useCallback((text) => {
    setError('');
    setExpression((prev) => prev + text);
  }, []);

  const inputDigit = useCallback((digit) => {
    setError('');
    setExpression((prev) => {
      const last = prev.split(/[^0-9.]/).pop();
      if (last === '0') return prev.slice(0, -1) + digit;
      return prev + digit;
    });
  }, []);

  const inputDot = useCallback(() => {
    setError('');
    setExpression((prev) => {
      const last = prev.split(/[^0-9.]/).pop();
      if (last.includes('.')) return prev;
      if (last === '') return prev + '0.';
      return prev + '.';
    });
  }, []);

  const inputOperator = useCallback((op) => {
    setError('');
    setExpression((prev) => {
      if (!prev) return op === '-' ? '-' : prev;
      const last = prev.slice(-1);
      if ('+-×÷^'.includes(last)) return prev.slice(0, -1) + op;
      if (last === '(') return op === '-' ? prev + op : prev;
      return prev + op;
    });
  }, []);

  const appendFunction = useCallback((name) => {
    setError('');
    setExpression((prev) => `${prev}${name}(`);
  }, []);

  const toggleSign = useCallback(() => {
    setError('');
    setExpression((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
  }, []);

  const reciprocal = useCallback(() => {
    setError('');
    setExpression((prev) => (prev ? `1÷(${prev})` : prev));
  }, []);

  const backspace = useCallback(() => {
    setError('');
    setExpression((prev) => {
      for (const token of FUNC_TOKENS) {
        if (prev.endsWith(token)) return prev.slice(0, -token.length);
      }
      return prev.slice(0, -1);
    });
  }, []);

  const clearAll = useCallback(() => {
    setExpression('');
    setResult('');
    setError('');
  }, []);

  const handleEquals = useCallback(() => {
    if (!expression.trim()) return;
    try {
      const value = service.calculate(expression);
      const formatted = formatNumber(value);
      setResult(formatted);
      setError('');
      service.addHistory({ expression, result: formatted });
      setHistory(service.getHistory());
      setExpression(formatted);
    } catch (err) {
      setError(err.message || 'Erro');
      setResult('');
    }
  }, [expression]);

  /* -------------------------------- memória ------------------------------- */
  const getCurrentValue = useCallback(() => {
    const value = service.preview(expression);
    if (value !== null) return value;
    const parsed = parseFloat(result);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [expression, result]);

  const memoryAdd = useCallback(() => setMemory((m) => m + getCurrentValue()), [getCurrentValue]);
  const memorySubtract = useCallback(() => setMemory((m) => m - getCurrentValue()), [getCurrentValue]);
  const memoryRecall = useCallback(() => {
    setError('');
    setExpression((prev) => prev + formatNumber(memory));
  }, [memory]);
  const memoryClear = useCallback(() => setMemory(0), []);

  /* ------------------------------- histórico ------------------------------ */
  const reuseHistory = useCallback((value) => {
    setError('');
    setExpression(String(value));
  }, []);

  const clearHistory = useCallback(() => {
    service.clearHistory();
    setHistory([]);
  }, []);

  /* -------------------------------- copiar -------------------------------- */
  const copyResult = useCallback(async () => {
    const text = output || expression;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(String(text));
    } catch {
      const el = document.createElement('textarea');
      el.value = String(text);
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }, [output, expression]);

  /* ------------------------------- teclado -------------------------------- */
  const actionsRef = useRef({});
  actionsRef.current = {
    inputDigit,
    inputDot,
    inputOperator,
    append,
    handleEquals,
    clearAll,
    backspace,
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const { key } = event;
      const actions = actionsRef.current;

      if (/^[0-9]$/.test(key)) return actions.inputDigit(key);
      if (key === '.' || key === ',') return actions.inputDot();
      if (key === '+') return actions.inputOperator('+');
      if (key === '-') return actions.inputOperator('-');
      if (key === '*') return actions.inputOperator('×');
      if (key === '/') return actions.inputOperator('÷');
      if (key === '^') return actions.inputOperator('^');
      if (key === '%') return actions.append('%');
      if (key === '(' || key === ')') return actions.append(key);
      if (key === 'Enter' || key === '=') {
        event.preventDefault();
        return actions.handleEquals();
      }
      if (key === 'Escape') return actions.clearAll();
      if (key === 'Backspace') {
        event.preventDefault();
        return actions.backspace();
      }
      return undefined;
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /* --------------------------------- render ------------------------------- */
  return (
    <div className="app">
      <div className="app__glow" aria-hidden="true" />

      <header className="app__header">
        <h1 className="app__title">
          Calculadora<span className="app__title-accent">Tech</span>
        </h1>
        <div className="app__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title="Alternar tema"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button
            type="button"
            className={`icon-btn ${historyOpen ? 'is-active' : ''}`}
            onClick={() => setHistoryOpen((open) => !open)}
            aria-label="Mostrar ou ocultar histórico"
            aria-expanded={historyOpen}
            title="Histórico"
          >
            🕘
          </button>
        </div>
      </header>

      <main className="app__main">
        <section className="calculator" aria-label="Calculadora">
          <CalculatorDisplay
            expression={expression}
            output={output}
            error={error}
            memory={memory}
            copied={copied}
          />

          <div className="calculator__memory" role="group" aria-label="Memória">
            <CalculatorButton label="MC" variant="memory" onClick={memoryClear} ariaLabel="Limpar memória" />
            <CalculatorButton label="MR" variant="memory" onClick={memoryRecall} ariaLabel="Recuperar memória" />
            <CalculatorButton label="M+" variant="memory" onClick={memoryAdd} ariaLabel="Somar à memória" />
            <CalculatorButton label="M−" variant="memory" onClick={memorySubtract} ariaLabel="Subtrair da memória" />
          </div>

          {scientific && (
            <div className="calculator__sci" role="group" aria-label="Funções científicas">
              <CalculatorButton label="√" variant="sci" onClick={() => appendFunction('√')} ariaLabel="Raiz quadrada" />
              <CalculatorButton label="x²" variant="sci" onClick={() => append('^2')} ariaLabel="Elevar ao quadrado" />
              <CalculatorButton label="xʸ" variant="sci" onClick={() => append('^')} ariaLabel="Elevar a uma potência" />
              <CalculatorButton label="1/x" variant="sci" onClick={reciprocal} ariaLabel="Inverso" />
              <CalculatorButton label="%" variant="sci" onClick={() => append('%')} ariaLabel="Porcentagem" />
              <CalculatorButton label="sin" variant="sci" onClick={() => appendFunction('sin')} ariaLabel="Seno" />
              <CalculatorButton label="cos" variant="sci" onClick={() => appendFunction('cos')} ariaLabel="Cosseno" />
              <CalculatorButton label="tan" variant="sci" onClick={() => appendFunction('tan')} ariaLabel="Tangente" />
              <CalculatorButton label="log" variant="sci" onClick={() => appendFunction('log')} ariaLabel="Logaritmo base 10" />
            </div>
          )}

          <div className="calculator__keys" role="group" aria-label="Teclado numérico">
            <CalculatorButton label="C" variant="danger" onClick={clearAll} ariaLabel="Limpar tudo" />
            <CalculatorButton label="⌫" variant="action" onClick={backspace} ariaLabel="Apagar último caractere" />
            <CalculatorButton label="(" variant="action" onClick={() => append('(')} ariaLabel="Abrir parêntese" />
            <CalculatorButton label=")" variant="action" onClick={() => append(')')} ariaLabel="Fechar parêntese" />

            <CalculatorButton label="7" onClick={() => inputDigit('7')} ariaLabel="Sete" />
            <CalculatorButton label="8" onClick={() => inputDigit('8')} ariaLabel="Oito" />
            <CalculatorButton label="9" onClick={() => inputDigit('9')} ariaLabel="Nove" />
            <CalculatorButton label="÷" variant="operator" onClick={() => inputOperator('÷')} ariaLabel="Dividir" />

            <CalculatorButton label="4" onClick={() => inputDigit('4')} ariaLabel="Quatro" />
            <CalculatorButton label="5" onClick={() => inputDigit('5')} ariaLabel="Cinco" />
            <CalculatorButton label="6" onClick={() => inputDigit('6')} ariaLabel="Seis" />
            <CalculatorButton label="×" variant="operator" onClick={() => inputOperator('×')} ariaLabel="Multiplicar" />

            <CalculatorButton label="1" onClick={() => inputDigit('1')} ariaLabel="Um" />
            <CalculatorButton label="2" onClick={() => inputDigit('2')} ariaLabel="Dois" />
            <CalculatorButton label="3" onClick={() => inputDigit('3')} ariaLabel="Três" />
            <CalculatorButton label="−" variant="operator" onClick={() => inputOperator('-')} ariaLabel="Subtrair" />

            <CalculatorButton label="±" variant="action" onClick={toggleSign} ariaLabel="Trocar sinal" />
            <CalculatorButton label="0" onClick={() => inputDigit('0')} ariaLabel="Zero" />
            <CalculatorButton label="." onClick={inputDot} ariaLabel="Ponto decimal" />
            <CalculatorButton label="+" variant="operator" onClick={() => inputOperator('+')} ariaLabel="Somar" />

            <CalculatorButton label="=" variant="equals" onClick={handleEquals} ariaLabel="Igual" wide />
          </div>

          <div className="calculator__footer">
            <button
              type="button"
              className={`toggle-btn ${scientific ? 'is-active' : ''}`}
              onClick={() => setScientific((value) => !value)}
              aria-pressed={scientific}
            >
              {scientific ? 'Modo científico: ON' : 'Modo científico: OFF'}
            </button>
            <button type="button" className="toggle-btn" onClick={copyResult} aria-label="Copiar resultado">
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </section>

        <aside className={`history ${historyOpen ? 'is-open' : ''}`} aria-label="Histórico de cálculos">
          <div className="history__header">
            <h2 className="history__title">Histórico</h2>
            <button type="button" className="history__clear" onClick={clearHistory} aria-label="Limpar histórico">
              Limpar
            </button>
          </div>

          {history.length === 0 ? (
            <p className="history__empty">Nenhum cálculo ainda.</p>
          ) : (
            <ul className="history__list">
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <button
                    type="button"
                    className="history__item"
                    onClick={() => reuseHistory(item.result)}
                    aria-label={`Reutilizar resultado ${item.result}`}
                  >
                    <span className="history__expression">{item.expression}</span>
                    <span className="history__result">= {item.result}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>
    </div>
  );
};

export default Calculator;
