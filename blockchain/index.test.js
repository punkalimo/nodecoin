const Blockchain = require('./index');
const Block = require('./block');
describe('BLockchain', ()=>{
    let bc, bc2;
    beforeEach(()=>{
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it(`starts with the genesis block`, ()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it(`adds a new block`, ()=>{
        const data = 'data';
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it(`invalidates a chain with a corrupt genesis block`, ()=>{
        bc2.chain[0].data = 'Corrupt data';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it(`invalidates a corrupt chain`, ()=>{
        bc2.addBlock('pasha');
        bc2.chain[1].data = 'satoshi';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it(`Replaces the chain with a valid chain`, ()=>{
        bc2.addBlock('lorem ipsum');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it(`doesnt replace the chain with one of less than or equal to length `, ()=>{
        bc.addBlock('javascript');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    })
});