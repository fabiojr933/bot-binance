const WebSocketClient = require('./webSocketClient');
const TransactionManager = require('./transactionManager');
const BinanceConfig = require('./config');

// Inicializar o TransactionManager
const transactionManager = new TransactionManager();

// Inicializar a configuração da Binance
(async () => {
  const binanceConfigInstance = new BinanceConfig();
  const tradingPairs = await binanceConfigInstance.initializeConfig();

  // Inicializar WebSocketClient para cada par de negociação
  tradingPairs.forEach(pair => {
    new WebSocketClient(pair, transactionManager);
  });
})();
