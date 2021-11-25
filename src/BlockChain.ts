import { Block } from './Block'

/**
 * A generic block chain that is able to store
 * any document type in a linked chain of blocks.
 *
 * Each block contains multiple documents.
 */
type BlockChain<Document, State> = {
    /**
     * Returns the final block in the chain.
     */
    last: () => Block<Document>
    /**
     * Adds a new block to the chain.
     *
     * This performs no validation.
     */
    addBlock: (block: Block<Document>) => BlockChain<Document, State>
    /**
     * Returns the whole block chain.
     */
    chain: () => Block<Document>[]
    /**
     * Returns the state of the blockchain by reducing over the documents.
     */
    state: () => State
}

type BlockChainArgs<Document, State> = {
    initialState: State
    stateReducer: (acc: State, prev: Document) => State
}

const BlockChain = <Document, State>({
    initialState,
    stateReducer,
}: BlockChainArgs<Document, State>): BlockChain<Document, State> => {
    const genisis = Block<Document>()

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
        state() {
            const documents = chain.flatMap(({ documents }) => documents)

            const state = documents.reduce(stateReducer, initialState)

            return state
        },
    }
}

export { BlockChain, BlockChainArgs }
