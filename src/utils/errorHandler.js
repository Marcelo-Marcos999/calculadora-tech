export class ErrorHandler {
  static handleDivisionByZero() {
    throw new Error('Divisão por zero não é permitida');
  }

  static handleInvalidInput(input) {
    throw new Error(`Entrada inválida: ${input}`);
  }

  static handleUnknownError(error) {
    throw new Error(`Erro desconhecido: ${error.message}`);
  }
}
