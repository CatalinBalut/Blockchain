const Blockchain = require('./blockchain');

const Block = require('./block');
const { genesis } = require('./block');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain, errorMock;

    //new instance of blockchain for each test
    beforeEach(() =>{
        blockchain = new Blockchain();
        newChain = new Blockchain();
        errorMock = jest.fn();

        originalChain = blockchain.chain;
        global.console.error=errorMock;
    });


    it('contains `chai n` Array instance', () =>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () =>{
        const newData = 'foo bar';
        blockchain.addBlock({data : newData});

        expect(blockchain.chain[blockchain.chain.length-1].data)
            .toEqual(newData);
    });

    //#1 rule -> chain starts with GenesisBlock
    describe('isValidChain()', () =>{
        describe('when the chain does not start with the genesis block', () => {
            it('returs false', () =>{
                blockchain.chain[0] = {data: 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        beforeEach(()=>{
            blockchain.addBlock({data:'Bears'});
            blockchain.addBlock({data:'Beets'});
            blockchain.addBlock({data:'Wolves'});
        })
        
        describe('when the chain starts with the genesisBlock AND  has multiple blocks',() => {
            describe('and a lastHash reference has changed', ()=>{
                it('returns false', ()=>{
                    blockchain.chain[2].lastHash = 'broken-lashHash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chains contains a block with an invalid field', () =>{
                it('retunrs false', () => { 
                    blockchain.chain[2].data = 'hacked-evil-data'
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            
            describe('and the chain does not contain any invalid blocks', () =>{
                it('returns true', () =>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });       
    });

     //REPLACE CHAIN ->every test in this file will have 
     //a fresh instance of a blockchain.
    describe('replaceChain()', () => {
        let logMock;

        beforeEach( () => {
            logMock = jest.fn();

            global.console.log = logMock;
        });

        describe('when the new chain is not longer', () => {
            beforeEach(() =>{
                newChain.chain[0] = {new: 'chain'};

                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when the new chain is longer', () => {
            beforeEach(() =>{
                newChain.addBlock({data:'Bears'});
                newChain.addBlock({data:'Beets'});
                newChain.addBlock({data:'Wolves'});
            });

            describe('and the chain is INVALID', () => {
                beforeEach(()=>{
                    newChain.chain[2].hash = 'some-fake-hash';
                    blockchain.replaceChain(newChain.chain);
                });

                it('does not replace the chain', () =>{
                 
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is VALID', () => {
                beforeEach(() =>{
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', () =>{     
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', () =>{
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });



});