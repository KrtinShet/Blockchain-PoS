const { GENESIS_DATA } = require("./../../config");
const cryptoHash = require("./../../utils/cryptoHash");

class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }
  toString() {
    return ` Block:
        TimeStamp: ${this.timestamp}
        LastHash: ${this.lastHash}
        Hash: ${this.hash}
        Data: ${this.data}
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

  static createBlock({ lastBlock, data }) {
    let timestamp = Date.now();
    return new this({
      timestamp,
      data,
      lastHash: lastBlock.hash,
      hash: cryptoHash(timestamp, lastBlock.hash, data),
    });
  }

  static blockHash(block) {
    return cryptoHash(block.timestamp, block.lastHash, block.data);
  }
}

module.exports = Block;
