import { Block } from "./Block";

type BlockChain<T> = {
  last: () => Block<T>;
  addBlock: (block: Block<T>) => BlockChain<T>;
  isValid: () => boolean;
  chain: () => Block<T>[];
};

const BlockChain = <T>(): BlockChain<T> => {
  const genisis = Block.of<T>();

  const chain = [genisis];

  return {
    last() {
      const [last] = chain.slice(-1);

      return last;
    },
    addBlock(block) {
      block.prevHash = this.last().hash;

      block.hash = Block.createHash(block);

      chain.push(block);

      return this;
    },
    isValid() {
      for (let i = 1; i < chain.length; i++) {
        const currentBlock = chain[i];
        const prevBlock = chain[i - 1];

        const isCurrentHashWrong =
          currentBlock.hash !== Block.createHash(currentBlock);

        const isPrevHashWrong = currentBlock.prevHash !== prevBlock.hash;

        if (isCurrentHashWrong || isPrevHashWrong) {
          return false;
        }
      }

      return true;
    },
    chain() {
      return chain;
    },
  };
};

export { BlockChain };
