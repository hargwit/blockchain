import { Block } from './Block'
import { BlockChain } from './BlockChain'
import { log } from './log'

type BalanceBook = {
    [user: string]: number
}

const balance = (book: BalanceBook, transaction: Transaction) => ({
    ...book,
    [transaction.from]: book[transaction.from] - transaction.amount,
    [transaction.to]: (book[transaction.to] || 0) + transaction.amount,
})

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
})

blockchain.addBlock(Block([Transaction('harry', 'rach', 1)]))

log(blockchain.state())
