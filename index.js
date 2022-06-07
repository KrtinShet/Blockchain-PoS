const express = require("express");

const BlockChain = require("./blockchain");

const PORT = 3000;
const blockchain = new BlockChain();
const app = express();

app.use(express.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.listen(PORT, () => {
  console.log(`node listening on port ${PORT}`);
});
