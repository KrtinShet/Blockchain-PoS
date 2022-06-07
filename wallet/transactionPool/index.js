const Transaction = require("./../transaction");
const { TRANSACTION_THRESHOLD } = require("../../config");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  thresholdReached() {
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true;
    } else {
      return false;
    }
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true;
    } else {
      return false;
    }
  }

  clear() {
    this.transactions = [];
  }

  transactionExists(transaction) {
    let exists = this.transactions.find((t) => t.id === transaction.id);
    return exists;
  }

  validTransactions() {
    return this.transactions.filter((transaction) => {
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.data.from}`);
        return;
      }

      return transaction;
    });
  }
}

module.exports = TransactionPool;
