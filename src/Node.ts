import { v4 as uuid } from "uuid";

import { BlockChain } from "./BlockChain";

type Node<T> = {
  id: string;
  blockchain: () => BlockChain<T>;
  consensus: () => BlockChain<T>;
  register: (node: Node<T>) => {
    network: Node<T>[];
    blockchain: BlockChain<T>;
  };
  registerTo: (node: Node<T>) => void;
};

const Node = <T>(): Node<T> => {
  let network: Node<T>[] = [];
  let blockchain: BlockChain<T> = BlockChain();

  return {
    id: uuid(),
    blockchain() {
      return blockchain;
    },
    consensus() {
      const validChains = network
        .map((node) => node.blockchain())
        .filter((blockchain) => blockchain.isValid());

      let longestChain = blockchain;
      for (const chain of validChains) {
        if (chain.chain().length > longestChain.chain.length) {
          longestChain = chain;
        }
      }

      blockchain = longestChain;

      return longestChain;
    },
    register(node) {
      const nodeNetwork = network;
      const nodeChain = this.consensus();

      network.push(node);

      return {
        network: nodeNetwork,
        blockchain: nodeChain,
      };
    },
    registerTo(node) {
      const { network: newNetwork, blockchain: newBlockchain } =
        node.register(this);

      network = newNetwork;
      blockchain = newBlockchain;
    },
  };
};

export { Node };
