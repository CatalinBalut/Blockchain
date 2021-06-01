const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

//testez clasa Block ->callback fuction
describe('Block', ()=> {
    const timestamp=  'a-date';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];

    const nonce = 1;
    const difficulty = 1;

    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    //create a test to check block have all the date
    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });
    
    //genesis ->static function
    describe('genesis()', () =>{
        const genesisBlock= Block.genesis();

        console.log('genesisBlock', genesisBlock);

        it('returns a Block instance', ()=>{
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });
     
    //MINEBLOCK
    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data= 'mined data';
        const minedBlock = Block.minedBlock({ lastBlock, data});

        //expect to return a block intance
        it('returns a block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () =>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () =>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(
                    minedBlock.timestamp, 
                    mined.nonce,
                    mined.difficulty,
                    lastBlock.hash, 
                    data, ))
        });
    });
    
});