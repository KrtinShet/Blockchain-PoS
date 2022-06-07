const Block = require("./index");
const cryptoHash = require("./../../utils/cryptoHash");
const { GENESIS_DATA } = require("./../../config");

describe("Block", () => {
  const timestamp = Date.now();
  const lastHash = "last-hash";
  const hash = "0xHash";
  const data = "test-data";
  const block = new Block({ timestamp, lastHash, hash, data });
  it("has timestamp, lastHash, hash, data properties", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });
  describe("genesis()", () => {
    const genesisBlock = Block.genesis();
    it("is an instance of Block", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it("returns Geneis Block", () => {
      const testGenesisBlock = new Block({
        timestamp: GENESIS_DATA.timestamp,
        lastHash: GENESIS_DATA.lastHash,
        hash: GENESIS_DATA.hash,
        data: GENESIS_DATA.data,
      });
      expect(genesisBlock.toString()).toEqual(testGenesisBlock.toString());
    });
  });
  describe("it returns block Hash", () => {
    it("true", () => {
      let timestamp = Date.now();
      let data = "test-data";
      let lastHash = "test-lastHash";
      const hash = cryptoHash(timestamp, lastHash, data);
      const block = new Block({
        timestamp,
        lastHash,
        hash,
        data,
      });
      expect(Block.blockHash(block)).toEqual(hash);
    });
  });
});
