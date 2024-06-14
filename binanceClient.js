const binance = require("binance-api-node").default;
require("dotenv").config();
const knex = require('./database/config');
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
      // caluclo para fazer a compra
      const order = await this.client.order({
        symbol: symbol,
        side: "BUY",
        type: "MARKET",
        quantity: quantity,
      });
      console.log("Compra realizada:", order);
      var data = [{
        'moeda': order.symbol,
        'preco_pago': order.fills[0].price,
        'qtde_compra': order.fills[0].qty
      }];

      //salvando no banco de dados a compra.
      await knex('compras').insert(data)
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
