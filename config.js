require("dotenv").config();
const axios = require('axios');
const knex = require('./database/config');

class BinanceConfig {
  constructor() {
    this.tradingPairs = [
      {
        symbol: "BTCUSDT",
        targetBuyPrice: 0.00,
        targetSellPrice: 0.00,
        quantity: 0.0001,
      },
      /* { symbol: 'ETHUSDT', targetBuyPrice: 2500.00, targetSellPrice: 3000.00, quantity: 0.01 }, 
      { symbol: 'BNBUSDT', targetBuyPrice: 606.26, targetSellPrice: 600.26, quantity: 0.01 }, */
      // Adicione mais pares conforme necessário
    ];
  }

  async getCurrentPrice(symbol) {
    const url = 'https://api.binance.com/api/v3/ticker/price';
    const params = { symbol };

    try {
      const response = await axios.get(url, { params });
      return parseFloat(response.data.price);
    } catch (error) {
      console.error(`Erro ao buscar o preço de ${symbol}:`, error);
      return null;
    }
  }

  async updateTradingPairs() {
    for (let pair of this.tradingPairs) {
      const dados = await knex('moedas').select('*').where({ 'moeda': pair.symbol });
      const currentPrice = await this.getCurrentPrice(pair.symbol);
      await knex('moedas').update({ valor: currentPrice }).where({ moeda: pair.symbol });
      if (currentPrice !== null) {
        pair.targetBuyPrice = currentPrice + parseFloat(parseFloat(dados[0].variacao).toFixed(2));
        pair.targetSellPrice = currentPrice - parseFloat(parseFloat(dados[0].variacao).toFixed(2)); 
      }
    }

    console.log('Pares de trading atualizados:', this.tradingPairs);
  }

  async initializeConfig() {
    await this.updateTradingPairs();
    return this.tradingPairs;
  }
}

module.exports = BinanceConfig;
