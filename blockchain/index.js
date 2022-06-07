const Block = require("./block");
const Stake = require("./stake");
const Account = require("./account");
const Validators = require("./validators");
const Wallet = require("./../wallet");
const { SECRET } = require("../config");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
    this.stakes = new Stake();
    this.accounts = new Account();
    this.validators = new Validators();
    this.wallet = new Wallet(SECRET);
  }

  addBlock({ data, wallet }) {
    let newBlock = Block.createBlock({
      data,
      lastBlock: this.chain[this.chain.length - 1],
      wallet: wallet || this.wallet,
    });
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (chain[0].toString() !== Block.genesis().toString()) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (lastBlock.hash !== block.lastHash) return false;
      if (block.hash !== Block.blockHash(block)) return false;
    }
    return true;
  }

  replaceChain(chain, validateTransactions, onSuccess) {
    if (chain.length <= this.chain.length) return;
    if (!BlockChain.isValidChain(chain)) return;
    if (validateTransactions && !this.isValidTransaction({ chain })) return;
    if (onSuccess) onSuccess();
    this.resetState();
    this.executeChain(chain);
    this.chain = chain;
  }

  getBalance(publicKey) {
    return this.accounts.getBalance(publicKey);
  }

  getLeader() {
    return this.stakes.getMax(this.validators.list);
  }

  initialize(address) {
    this.accounts.initialize(address);
    this.stakes.initialize(address);
  }

  isValidBlock(block) {
    const { data } = block;
    const lastBlock = this.chain[this.chain.length - 1];
    if (
      block.lastHash === lastBlock.hash &&
      block.hash === Block.blockHash(block) &&
      Block.verifyBlock(block) &&
      Block.verifyLeader(block, this.getLeader())
    ) {
      console.log("block valid");
      this.addBlock({ data, wallet: wallet || this.wallet });
      this.executeTransactions(block);
      return true;
    }

    return false;
  }

  executeTransactions(block) {
    block.data.forEach((transaction) => {
      switch (transaction.type) {
        case TRANSACTION_TYPE.transaction:
          this.accounts.update(transaction);
          this.accounts.transferFee(block, transaction);
          break;
        case TRANSACTION_TYPE.stake:
          this.stakes.update(transaction);
          this.accounts.decrement(
            transaction.input.from,
            transaction.output.amount
          );
          this.accounts.transferFee(block, transaction);

          break;
        case TRANSACTION_TYPE.validator_fee:
          console.log("VALIDATOR_FEE");
          if (this.validators.update(transaction)) {
            this.accounts.decrement(
              transaction.input.from,
              transaction.output.amount
            );
            this.accounts.transferFee(block, transaction);
          }
          break;
      }
    });
  }

  executeChain(chain) {
    chain.forEach((block) => {
      this.executeTransactions(block);
    });
  }

  resetState() {
    this.chain = [Block.genesis()];
    this.stakes = new Stake();
    this.accounts = new Account();
    this.validators = new Validators();
  }
}

module.exports = BlockChain;
