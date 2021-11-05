import { v4 as uuid } from 'uuid'

import { BlockChain, BlockChainArgs } from './BlockChain'

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
    id: string
    /**
     * Returns the blockchain this node has
     */
    blockchain: () => BlockChain<T>
    /**
     * Returns the blockchain that the network agrees on.
     *
     * Also sets this nodes blockchain to that blockchain.
     */
    consensus: () => BlockChain<T>
    /**
     * Registers a new node to the network.
     */
    register: (node: Node<T>) => {
        network: Node<T>[]
        blockchain: BlockChain<T>
    }
    /**
     * Registers this node to another network.
     */
    registerTo: (node: Node<T>) => void
    /**
     * Adds a new peice of data to the blockchain.
     *
     * This data will be pending until it is picked up and
     * added to the next block.
     */
    add: (document: T) => void
}

type NodeArgs<T> = {
    blockchainArgs?: BlockChainArgs<T>
}

const Node = <T>(args: NodeArgs<T> = {}): Node<T> => {
    let network: Node<T>[] = []
    let blockchain: BlockChain<T> = BlockChain(args.blockchainArgs)
    const pendingDocuments: T[] = []

    return {
        id: uuid(),
        blockchain() {
            return blockchain
        },
        consensus() {
            const validChains = network.map((node) => node.blockchain()).filter((blockchain) => blockchain.isValid())

            let longestChain = blockchain
            for (const chain of validChains) {
                if (chain.chain().length > longestChain.chain.length) {
                    longestChain = chain
                }
            }

            blockchain = longestChain

            return longestChain
        },
        register(node) {
            const nodeNetwork = network
            const nodeChain = this.consensus()

            network.push(node)

            return {
                network: nodeNetwork,
                blockchain: nodeChain,
            }
        },
        registerTo(node) {
            const { network: newNetwork, blockchain: newBlockchain } = node.register(this)

            network = newNetwork
            blockchain = newBlockchain
        },
        add(document) {
            if (!blockchain.validateDocument(document)) {
                return
            }

            pendingDocuments.push(document)

            network.forEach((node) => {
                node.add(document)
            })
        },
    }
}

export { Node }
