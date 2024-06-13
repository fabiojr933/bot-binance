const BinanceClient = require('./binanceClient');

class TransactionManager {
  constructor() {
    this.binanceClient = new BinanceClient();
    this.TRANSACTION_LIMIT = 20;
    this.transactionCount = 0;

    // Reinicializar o contador de transações a cada 30 segundos
    setInterval(() => {
      this.transactionCount = 0;
      console.log('Contador de transações reinicializado.');
    }, 30 * 1000); // 30 segundos
  }

  async executeTransaction(symbol, quantity, type) {
    if (this.transactionCount >= this.TRANSACTION_LIMIT) {
      console.log('Limite de transações atingido. Aguardando...');
      return;
    }
    
    if (type === 'buy') {
      await this.binanceClient.buy(symbol, quantity);
    } else if (type === 'sell') {
      await this.binanceClient.sell(symbol, quantity);
    }

    this.transactionCount++;
    console.log(`Transação ${type} para ${symbol} realizada. Contagem atual: ${this.transactionCount}`);
  }
}

module.exports = TransactionManager;
