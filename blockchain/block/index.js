const { GENESIS_DATA } = require("./../../config");
const { cryptoHash } = require("./../../utils");

class Block {
  constructor({ timestamp, lastHash, hash, data, validator, signature }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.validator = validator;
    this.signature = signature;
  }
  toString() {
    return ` Block:
        TimeStamp: ${this.timestamp}
        LastHash: ${this.lastHash}
        Hash: ${this.hash}
        Data: ${this.data}
        Validator: ${this.validator}
        Signature: ${this.signature}
      `;
  }
  static genesis() {
    return new this({
      timestamp: GENESIS_DATA.timestamp,
      lastHash: GENESIS_DATA.lastHash,
      hash: GENESIS_DATA.hash,
      data: GENESIS_DATA.data,
    });
  }

  static createBlock({ lastBlock, data, wallet }) {
    let timestamp = Date.now();
    let lastHash = lastBlock.hash;
    let hash = cryptoHash(timestamp, lastHash, data);
    let validator = wallet.getPublicKey();
    let signature = Block.signBlockHash(hash, wallet);
    return new this({
      timestamp,
      data,
      lastHash,
      hash,
      validator,
      signature,
    });
  }

  static blockHash(block) {
    return cryptoHash(block.timestamp, block.lastHash, block.data);
  }

  static signBlockHash(hash, wallet) {
    return wallet.sign(hash);
  }
}

module.exports = Block;
