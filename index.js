const express = require("express");

const BlockChain = require("./blockchain");
const Wallet = require("./wallet");
const TransactionPool = require("./wallet/transactionPool");
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const { SECRET } = require("./config");

const blockchain = new BlockChain();
const app = express();
const wallet = new Wallet(Date.now().toString());
const transactionPool = new TransactionPool();
const p2pserver = new P2pserver(blockchain, transactionPool, wallet);

app.use(express.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/api/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

app.post("/api/transact", (req, res) => {
  const { to, amount, type } = req.body;
  const transaction = wallet.createTransaction(
    to,
    amount,
    type,
    blockchain,
    transactionPool
  );
  p2pserver.broadcastTransaction(transaction);
  res.redirect("/api/transactions");
});

app.get("/api/bootstrap", (req, res) => {
  p2pserver.bootstrapSystem();
  res.json({ message: "System bootstraped" });
});

app.get("/api/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get("/api/balance", (req, res) => {
  res.json({ balance: blockchain.getBalance(wallet.publicKey) });
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});

p2pserver.listen();
