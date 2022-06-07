const { genKeyPain } = require("../utils");
const Transaction = require("./transaction");

class Wallet {
  constructor(secret) {
    this.balance = 100;
    this.keyPair = genKeyPain(secret);
    this.publicKey = this.keyPair.getPublic("hex");
  }

  toString() {
    return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`;
  }

  getBalance(blockchain) {
    return blockchain.getBalance(this.publicKey);
  }

  getPublicKey() {
    return this.publicKey;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash).toHex();
  }

  createTransaction(to, amount, type, blockchain, transactionPool) {
    this.balance = this.getBalance(blockchain);
    if (amount > this.balance) {
      console.log(
        `ERROR: ${amount} exceeds the current balance: ${this.balance}`
      );
      return;
    }
    let transaction = Transaction.newTransaction(this, to, amount, type);
    transactionPool.addTransaction(transaction);
    return transaction;
  }
}

module.exports = Wallet;
