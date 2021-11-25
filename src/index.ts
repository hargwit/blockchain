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

blockchain.addBlock(Block([Transaction('harry', 'rach', 1), Transaction('rach', 'harry', 2)]))

log(blockchain.state())
