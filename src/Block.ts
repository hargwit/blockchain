import crypto from 'crypto'

const SHA256 = (message: string): string => crypto.createHash('sha256').update(message).digest('hex')

type Block<T> = {
    timestamp: string
    documents: T[]
    prevHash: string
    hash: string
}

const Block = <T>(timestamp: string, documents: T[] = []): Block<T> => {
    const block: Block<T> = {
        timestamp,
        documents,
        prevHash: '',
        hash: '',
    }

    block.hash = Block.createHash(block)

    return block
}

Block.createHash = <T>(block: Block<T>) => SHA256(block.prevHash + block.timestamp + JSON.stringify(block.documents))

Block.of = <T>(documents: T[] = []) => Block(Date.now().toString(), documents)

export { Block }
