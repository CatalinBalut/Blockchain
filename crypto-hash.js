const crypto = require('crypto');


const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256')

    //sort the inputs to get the same hash so it doesn t\
    //matter how we get he input
    hash.update(inputs.sort().join(' '));

    //the way we want the hash
     return hash.digest('hex');
};



module.exports = cryptoHash;