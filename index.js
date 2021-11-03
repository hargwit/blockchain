const crypto = require("crypto");

const SHA256 = (message) =>
  crypto.createHash("sha256").update(message).digest("hex");

const Block = (timestamp = "", data = []) => {
  const block = {
    timestamp,
    data,
    prevHash: "",
    hash: "",
    nonce: 0,
    mine(difficulty) {
      // Basically, it loops until our hash starts with
      // the string 0...000 with length of <difficulty>.
      while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
        // We increases our nonce so that we can get a whole different hash.
        this.nonce++;
        // Update our new hash with the new nonce value.
        this.hash = Block.createHash(this);
      }
    },
  };

  block.hash = Block.createHash(block);

  return block;
};

Block.createHash = (block) =>
  SHA256(
    block.prevHash + block.timestamp + JSON.stringify(block.data) + block.nonce
  );

Block.of = (data) => Block(Date.now().toString(), data);

const BlockChain = ({ difficulty = 1 }) => ({
  difficulty,
  chain: [Block.of()],
  last() {
    const [last] = this.chain.slice(-1);

    return last;
  },
  addBlock(block) {
    block.prevHash = Block.createHash(this.last());

    block.hash = Block.createHash(block);

    block.mine(this.difficulty);

    this.chain.push(block);
  },
  isValid() {
    // Iterate over the chain
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      // Check validation
      if (
        currentBlock.hash !== Block.createHash(currentBlock) ||
        prevBlock.hash !== currentBlock.prevHash
      ) {
        return false;
      }
    }

    return true;
  },
});

const blockChain = BlockChain({ difficulty: 30 });

blockChain.addBlock(Block.of({ foo: "bar" }));

console.log(blockChain.isValid());

console.log(blockChain.chain);
