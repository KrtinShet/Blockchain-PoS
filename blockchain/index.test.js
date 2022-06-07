const Block = require("./block");
const BlockChain = require("./index");
describe("BlockChain", () => {
  let blockchain;
  beforeEach(() => {
    blockchain = new BlockChain();
  });
  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = "new test data";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("does not starts with genesis Block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    describe("starts with genesis Block, has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Block 2 data" });
        blockchain.addBlock({ data: "Block 3 data" });
        blockchain.addBlock({ data: "Block 4 data" });
      });
      describe("lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "some invalid hash";
          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("contains block with invalid field", () => {
        it("returns false", () => {
          blockchain.chain[3].data = "some invalid data";
          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      it("is valid chain", () => {
        expect(BlockChain.isValidChain(blockchain.chain)).toBe(true);
      });
    });
  });
});
