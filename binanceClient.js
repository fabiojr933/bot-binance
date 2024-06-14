const binance = require("binance-api-node").default;
require("dotenv").config();

const { apiKey, apiSecret } = require("./config");

class BinanceClient {
  constructor() {    
    this.client = binance({
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET,
      httpBase: "https://testnet.binance.vision", // Usando o endpoint da Testnet
    });
  }

  async buy(symbol, quantity) {
    try {
      const order = await this.client.order({
        symbol: symbol,
        side: "BUY",
        type: "MARKET",
        quantity: quantity,
      });
      console.log("Compra realizada:", order);
    } catch (error) {
      console.error("Erro ao realizar a compra:", error);
    }
  }

  async sell(symbol, quantity) {
    try {
      const order = await this.client.order({
        symbol: symbol,
        side: "SELL",
        type: "MARKET",
        quantity: quantity,
      });
      console.log("Venda realizada:", order);
    } catch (error) {
      console.error("Erro ao realizar a venda:", error);
    }
  }
}

module.exports = BinanceClient;
