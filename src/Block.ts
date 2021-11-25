import { hash } from './hash'

type Block<T> = {
    timestamp: string
    documents: T[]
    prevHash: string
    hash: string
    nonce: number
}

const Block = <T>(documents: T[] = [], timestamp = Date.now().toString()): Block<T> => {
    const block: Block<T> = {
        timestamp,
        documents,
        prevHash: '',
        hash: '',
        nonce: 0,
    }

    block.hash = Block.hash(block)

    return block
}

Block.hash = <T>({ timestamp, documents, prevHash, nonce }: Block<T>) =>
    hash(`${timestamp}${JSON.stringify(documents)}${prevHash}${nonce}`)

export { Block }
