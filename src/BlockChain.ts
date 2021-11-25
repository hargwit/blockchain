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
    /**
     * The initial state of the blockchain.
     */
    initialState: State
    /**
     * A reducer that determines how the state of the blockchain
     * should be determined.
     */
    stateReducer: (acc: State, prev: Document) => State
    /**
     * Validates an incoming document. Should throw if document is not valid.
     */
    validateDocument: (document: Document, state: State) => void
}

const BlockChain = <Document, State>({
    initialState,
    stateReducer,
    validateDocument,
}: BlockChainArgs<Document, State>): BlockChain<Document, State> => {
    const genisis = Block<Document>()

    const chain = [genisis]

    return {
        last() {
            const [last] = chain.slice(-1)

            return last
        },
        addBlock(block) {
            const currentState = this.state()

            block.documents.forEach((document, index, documents) => {
                const stateUpToDoc = documents.slice(0, index).reduce(stateReducer, currentState)

                validateDocument(document, stateUpToDoc)
            })

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
