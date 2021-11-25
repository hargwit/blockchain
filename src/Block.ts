import { hash } from './hash'

type Block<T> = {
    timestamp: string
    documents: T[]
    prevHash: string
    hash: string
    nonce: number
}

const Block = <T>(timestamp: string, documents: T[] = []): Block<T> => {
    const block: Block<T> = {
        timestamp,
        documents,
        prevHash: '',
        hash: '',
        nonce: 0,
    }

    block.hash = Block.createHash(block)

    return block
}

Block.createHash = <T>(block: Block<T>) => hash(JSON.stringify(block))

Block.of = <T>(documents: T[] = []) => Block(Date.now().toString(), documents)

export { Block }
