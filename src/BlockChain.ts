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
     * Returns whether or not the whole chain is valid.
     *
     * It does this by comparing hashes.
     */
    isValid: () => boolean
    /**
     * Returns the whole block chain.
     */
    chain: () => Block<T>[]
    /**
     * Validates a document assuming it is to be the next
     * document in the chain.
     *
     * Calls the provided validateDocument function.
     */
    validateDocument: (document: T) => boolean
}

type BlockChainArgs<T> = {
    validateDocument?: (document: T, chainDocuments: T[]) => boolean
}

const BlockChain = <T>({ validateDocument = () => true }: BlockChainArgs<T> = {}): BlockChain<T> => {
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
        isValid() {
            for (let i = 1; i < chain.length; i++) {
                const currentBlock = chain[i]
                const prevBlock = chain[i - 1]

                const isCurrentHashWrong = currentBlock.hash !== Block.hash(currentBlock)

                const isPrevHashWrong = currentBlock.prevHash !== prevBlock.hash

                if (isCurrentHashWrong || isPrevHashWrong) {
                    return false
                }
            }

            return true
        },
        chain() {
            return chain
        },
        validateDocument(document) {
            return validateDocument(
                document,
                chain.flatMap((block) => block.documents)
            )
        },
    }
}

export { BlockChain, BlockChainArgs }
