require('dotenv').config();

module.exports = {
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  tradingPairs: [
    { symbol: 'BTCUSDT', targetBuyPrice: 67110.00, targetSellPrice: 68550.00, quantity: 0.0001 },
    { symbol: 'ETHUSDT', targetBuyPrice: 2500.00, targetSellPrice: 3000.00, quantity: 0.01 }, 
    { symbol: 'BNBUSDT', targetBuyPrice: 606.26, targetSellPrice: 600.26, quantity: 0.01 },
    // Adicione mais pares conforme necessário
  ],
};



