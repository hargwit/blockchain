import { Block } from "./Block";

import { BlockChain } from "./BlockChain";

type Transaction = {
  from: string;
  to: string;
  amount: number;
};

const Transaction = (
  from: string,
  to: string,
  amount: number
): Transaction => ({
  from,
  to,
  amount,
});

const harryCoin = BlockChain<Transaction>();

harryCoin.addBlock(
  Block(Date.now().toString(), [
    Transaction("harry", "rach", 10),
    Transaction("rach", "harry", 5),
  ])
);

harryCoin.addBlock(
  Block(Date.now().toString(), [
    Transaction("harry", "rach", 10),
    Transaction("rach", "harry", 5),
  ])
);

console.log(JSON.stringify(harryCoin.chain(), null, 4));

console.log(harryCoin.isValid());
