const Block = require("./block");
class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  addBlock({ data }) {
    let newBlock = Block.createBlock({
      data,
      lastBlock: this.chain[this.chain.length - 1],
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
}

module.exports = BlockChain;
