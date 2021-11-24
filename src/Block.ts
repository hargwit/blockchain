import crypto from 'crypto'

const SHA256 = (message: string): string => crypto.createHash('sha256').update(message).digest('hex')

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

Block.createHash = <T>(block: Block<T>) => SHA256(JSON.stringify(block))

Block.of = <T>(documents: T[] = []) => Block(Date.now().toString(), documents)

export { Block }
