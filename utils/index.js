const EDDSA = require("elliptic").eddsa;
const eddsa = new EDDSA("ed25519");
const crypto = require("crypto");
const UUID = require("uuid").v1;
const SHA256 = require("crypto-js").SHA256;

const genKeyPain = (secret) => {
  return eddsa.keyFromSecret(secret);
};
const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");

  hash.update(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join(" ")
  );

  return hash.digest("hex");
};
const id = () => UUID();
const sha256 = (data) => SHA256(JSON.stringify(data)).toString();
const verifySignature = (publicKey, signature, dataHash) =>
  eddsa.keyFromPublic(publicKey).verify(dataHash, signature);

module.exports = {
  genKeyPain,
  id,
  sha256,
  verifySignature,
  cryptoHash,
};
