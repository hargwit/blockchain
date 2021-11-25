import { Block } from './Block'
import { BlockChain } from './BlockChain'
import { log } from './log'

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

const blockchain = BlockChain<Transaction>()

blockchain.addBlock(Block([Transaction('harry', 'rach', 1)]))

log(blockchain.chain())
