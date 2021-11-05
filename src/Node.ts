import { v4 as uuid } from "uuid";

import { BlockChain } from "./BlockChain";

/**
 * A node maintains its own version the blockchain.
 *
 * It has a number of responsibilities:
 * - Registering new nodes on the network
 * - Mining new blocks
 * - Validating new data
 */
type Node<T> = {
  /**
   * The node identifier
   */
  id: string;
  /**
   * Returns the blockchain this node has
   */
  blockchain: () => BlockChain<T>;
  /**
   * Returns the blockchain that the network agrees on.
   *
   * Also sets this nodes blockchain to that blockchain.
   */
  consensus: () => BlockChain<T>;
  /**
   * Registers a new node to the network.
   */
  register: (node: Node<T>) => {
    network: Node<T>[];
    blockchain: BlockChain<T>;
  };
  /**
   * Registers this node to another network.
   */
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
