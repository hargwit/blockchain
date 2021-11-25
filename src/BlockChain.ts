import { Block } from './Block'

/**
 * A generic block chain that is able to store
 * any document type in a linked chain of blocks.
 *
 * Each block contains multiple documents.
 */
type BlockChain<T> = {
    /**
     * Returns the final block in the chain.
     */
    last: () => Block<T>
    /**
     * Adds a new block to the chain.
     *
     * This performs no validation.
     */
    addBlock: (block: Block<T>) => BlockChain<T>
    /**
     * Returns the whole block chain.
     */
    chain: () => Block<T>[]
}

const BlockChain = <T>(): BlockChain<T> => {
    const genisis = Block<T>()

    const chain = [genisis]

    return {
        last() {
            const [last] = chain.slice(-1)

            return last
        },
        addBlock(block) {
            block.prevHash = this.last().hash

            block.hash = Block.hash(block)

            chain.push(block)

            return this
        },
        chain() {
            return chain
        },
    }
}

export { BlockChain }
