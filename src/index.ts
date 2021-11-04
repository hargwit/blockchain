import { Block } from "./Block";

import { BlockChain } from "./BlockChain";

type Transaction = {
  from: string;
  to: string;
  amount: number;
};

type Ledger = Transaction[];

const harryCoin = BlockChain<Ledger>();

harryCoin.addBlock(
  Block(Date.now().toString(), [
    { from: "harry", to: "rach", amount: 10 },
    { from: "rach", to: "harry", amount: 5 },
  ])
);

harryCoin.addBlock(
  Block(Date.now().toString(), [
    { from: "harry", to: "rach", amount: 10 },
    { from: "rach", to: "harry", amount: 5 },
  ])
);

console.log(JSON.stringify(harryCoin.chain(), null, 4));

console.log(harryCoin.isValid());
