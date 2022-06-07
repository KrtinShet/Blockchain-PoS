const { TRANSACTION_FEE } = require("./../../config");
const { id, sha256, verifySignature } = require("./../../utils");

class Transaction {
  constructor() {
    this.id = id();
    this.type = null;
    this.input = null;
    this.output = null;
  }
  static newTransaction(senderWallet, to, amount, type) {
    if (amount + TRANSACTION_FEE > senderWallet.balance) {
      console.log("ERROR: insufficient balance");
      return;
    }
    return Transaction.generateTransaction(senderWallet, to, amount, type);
  }

  static generateTransaction(senderWallet, to, amount, type) {
    const transaction = new this();
    transaction.type = type;
    transaction.output = {
      to,
      amount: amount - TRANSACTION_FEE,
      fee: TRANSACTION_FEE,
    };
    transaction.input = this.signTransaction(transaction.output, senderWallet);
    return transaction;
  }

  static signTransaction(data, senderWallet) {
    return {
      timestamp: Date.now(),
      from: senderWallet.publicKey,
      signature: senderWallet.sign(sha256(data)),
    };
  }

  static verifyTransaction(transaction) {
    return verifySignature(
      transaction.input.from,
      transaction.input.signature,
      sha256(transaction.output)
    );
  }
}

module.exports = Transaction;
