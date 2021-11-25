import { BlockChain } from './BlockChain'

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

type HarryCoin = BlockChain<Transaction, BalanceBook>

const HarryCoin = (initialBook: BalanceBook): HarryCoin =>
    BlockChain({
        initialState: initialBook,
        stateReducer: balance,
        validateDocument: validateTransaction,
    })

export { HarryCoin, Transaction, BalanceBook }
