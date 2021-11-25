import { Block } from './Block'
import { BlockChain } from './BlockChain'
import { log } from './log'

type BalanceBook = {
    [user: string]: number
}

const balance = (book: BalanceBook, transaction: Transaction): BalanceBook => ({
    ...book,
    [transaction.from]: book[transaction.from] - transaction.amount,
    [transaction.to]: (book[transaction.to] || 0) + transaction.amount,
})

const validateTransaction = (transaction: Transaction, book: BalanceBook) => {
    if (book[transaction.from] < transaction.amount) {
        throw new Error('insufficient funds')
    }
}

type Transaction = {
    from: string
    to: string
    amount: number
}

const Transaction = (from: string, to: string, amount: number): Transaction => ({
    from,
    to,
    amount,
})

const blockchain = BlockChain<Transaction, BalanceBook>({
    initialState: {
        harry: 100,
    },
    stateReducer: balance,
    validateDocument: validateTransaction,
})

try {
    blockchain
        .addBlock(Block([Transaction('harry', 'rach', 1)]))
        .addBlock(Block([Transaction('harry', 'rach', 1)]))
        .addBlock(Block([Transaction('rach', 'harry', 3)]))
} catch (error) {
    if (error instanceof Error) {
        console.log('Failed to add block due to error: ', error.message)
    }
}

log(blockchain.state())
