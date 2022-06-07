const Block = require("./block");
const BlockChain = require("./index");
describe("BlockChain", () => {
  let blockchain, newChain, originalChain;
  beforeEach(() => {
    blockchain = new BlockChain();
    originalChain = blockchain.chain;
    newChain = new BlockChain();
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

  describe("replaceChain()", () => {
    let logMock;
    beforeEach(() => {
      logMock = jest.fn();
      global.console.error = logMock;
    });

    describe("new chain is not longer", () => {
      it("does not replace the chain", () => {
        //when the chain is of same length and gets replaced, it's hard to find out and to catch the error
        //just a change in parameter to make sure that the chain has been replaced
        newChain.chain[0] = { newchain: true };
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe("new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Block 2 data" });
        newChain.addBlock({ data: "Block 3 data" });
        newChain.addBlock({ data: "Block 4 data" });
      });
      describe("new Chain is invalid", () => {
        it("does not replaces the chain", () => {
          newChain.chain[2].hash = "some invalid hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });
      describe("new Chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
