import { Block } from './Block'
import { HarryCoin, Transaction } from './HarryCoin'
import { log } from './log'

const harryCoin = HarryCoin({
    harry: 100,
})

try {
    harryCoin
        .addBlock(Block([Transaction('harry', 'rach', 1)]))
        .addBlock(Block([Transaction('harry', 'rach', 1)]))
        .addBlock(Block([Transaction('rach', 'harry', 3)]))
} catch (error) {
    if (error instanceof Error) {
        console.log('Failed to add block due to error: ', error.message)
    }
}

log(harryCoin.state())
