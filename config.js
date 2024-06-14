require("dotenv").config();
const axios = require('axios');

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
      const currentPrice = await this.getCurrentPrice(pair.symbol);
      if (currentPrice !== null) {
        /*AQUI FAZER A REGRA ACONTECER*/
        pair.targetBuyPrice = currentPrice;
        pair.targetSellPrice = currentPrice - 500;
        console.log(`O preço atual do ${pair.symbol} é: ${currentPrice} USDT`);
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
