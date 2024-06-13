const WebSocketClient = require('./webSocketClient');
const TransactionManager = require('./transactionManager');
const { tradingPairs } = require('./config');

// Inicializar o TransactionManager
const transactionManager = new TransactionManager();

// Inicializar WebSocketClient para cada par de negociação
tradingPairs.forEach(pair => {
  new WebSocketClient(pair, transactionManager);
});
