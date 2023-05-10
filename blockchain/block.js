const ChainUtil = require('../chain_util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block{
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data = data;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return ` Block -
        Timestamp.: ${this.timestamp}
        Last Hash.: ${this.lastHash.substring(0, 10)}
        Hash......: ${this.hash.substring(0, 20)}
        Nonce.....: ${this.nonce}
        Data......: ${this.data}
        Difficulty: ${this.difficulty}
        `
    }

    static genesis(){
        return new this('1970-01-01 00 00:00:00(UTC)','------','f15rt-h45h',[], 0);
    }
    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty }=lastBlock;
        let nonce = 0;
    
        do {
        nonce++;
        timestamp = Date.now();
        difficulty = Block.adjustDifficulty(lastBlock, timestamp);
        hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
      } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
      return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
      }

    static blockHash(block){
        const { timestamp, lastHash, data, nonce,difficulty }= block;
        return Block.hash(timestamp, lastHash, data,nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime){
        let { difficulty} =lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty -1;
        return difficulty;
    }
}

module.exports = Block;