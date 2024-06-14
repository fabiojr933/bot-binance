const WebSocket = require('ws');
const BinanceClient = require('./binanceClient');
const knex = require('./database/config');

class WebSocketClient {
  constructor(tradingPair, transactionManager) {
    this.binanceClient = new BinanceClient();
    this.transactionManager = transactionManager;
    this.symbol = tradingPair.symbol;
    this.targetBuyPrice = tradingPair.targetBuyPrice;
    this.targetSellPrice = tradingPair.targetSellPrice;
    this.quantity = parseFloat(tradingPair.quantity);
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
    // AJUSTAR 
    const dados = await knex('moedas').select('*').where({ 'moeda': this.symbol });
    console.log(dados[0].qtde_comprar);

    // COMPRA
    if (currentPrice <= this.targetBuyPrice) {
      //Verifica se o saldo disponivel dessa moeda no banco de dados, for menor que a quantidade de compra, não deixa comprar.
      if (dados[0].qtde_saldo >= dados[0].qtde_comprar) {

        this.quantity = parseFloat(dados[0].qtde_comprar);
        console.log(`Preço abaixo do alvo de compra para ${this.symbol}, comprando...`);
        await this.transactionManager.executeTransaction(this.symbol, this.quantity, 'buy');
        // Atualiza o saldo;
        const saldo_atualizado = parseFloat(dados[0].qtde_saldo) + parseFloat(this.quantity);
        await knex('moedas').update({ qtde_saldo: saldo_atualizado }).where({ moeda: this.symbol });

      }

      //VENDA
    } else if (currentPrice >= this.targetSellPrice) {
      if (dados[0].qtde_saldo >= dados[0].qtde_comprar) {
        this.quantity = parseFloat(dados[0].qtde_comprar);
        console.log(`Preço acima do alvo de venda para ${this.symbol}, vendendo...`);
        await this.transactionManager.executeTransaction(this.symbol, this.quantity, 'sell');
      }
    } else {
      console.log(`Preço fora dos alvos de compra e venda para ${this.symbol}, aguardando...`);
    }
  }
}

module.exports = WebSocketClient;
