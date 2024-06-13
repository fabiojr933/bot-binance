const WebSocket = require('ws');
const BinanceClient = require('./binanceClient');

class WebSocketClient {
  constructor(tradingPair, transactionManager) {
    this.binanceClient = new BinanceClient();
    this.transactionManager = transactionManager;
    this.symbol = tradingPair.symbol;
    this.targetBuyPrice = tradingPair.targetBuyPrice;
    this.targetSellPrice = tradingPair.targetSellPrice;
    this.quantity = tradingPair.quantity;
    this.ws = new WebSocket(`wss://testnet.binance.vision/ws/${this.symbol.toLowerCase()}@trade`);

    this.ws.on('message', (data) => {
      const message = JSON.parse(data);
      const currentPrice = parseFloat(message.p);
      this.processPriceUpdate(currentPrice);
    });

    this.ws.on('open', () => {
      console.log(`Conectado ao WebSocket da Binance para ${this.symbol} atualizações de preço em tempo real.`);
    });

    this.ws.on('close', () => {
      console.log(`Desconectado do WebSocket da Binance para ${this.symbol}.`);
    });

    this.ws.on('error', (error) => {
      console.error(`Erro no WebSocket da Binance para ${this.symbol}:`, error);
    });
  }

  async processPriceUpdate(currentPrice) {
    console.log(`Preço atual do ${this.symbol}:`, currentPrice);

    if (currentPrice <= this.targetBuyPrice) {
      console.log(`Preço abaixo do alvo de compra para ${this.symbol}, comprando...`);
      await this.transactionManager.executeTransaction(this.symbol, this.quantity, 'buy');
    } else if (currentPrice >= this.targetSellPrice) {
      console.log(`Preço acima do alvo de venda para ${this.symbol}, vendendo...`);
      await this.transactionManager.executeTransaction(this.symbol, this.quantity, 'sell');
    } else {
      console.log(`Preço fora dos alvos de compra e venda para ${this.symbol}, aguardando...`);
    }
  }
}

module.exports = WebSocketClient;
