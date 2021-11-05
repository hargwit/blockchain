import { Node } from './Node'

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

const node1 = Node<Transaction>()

const node2 = Node<Transaction>()

node2.registerTo(node1)

console.log(node1.blockchain().chain())
console.log(node2.blockchain().chain())

// Node A wants to join network
// Node A tells Node B it wants to join
// Node B notifies other nodes of Node A
// Node B adds Node A to list of nodes
// Node B gives Node A the current blockchain and its list of nodes

// Wallet wants to create a document
// Wallet sends new document to random Node X
// Node X adds document to list of pending documents
// Node X informs rest of network about document
// Node X builds a new block of N documents
// Node X validates and hashes the new block
// Node X sends block to rest of network
// Other Nodes validate the block, ignoring it if it's rubbish
