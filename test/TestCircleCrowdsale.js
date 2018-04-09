var CircleTokenCrowdsale = artifacts.require("./CircleCrowdsale.sol");
var CircleToken = artifacts.require("./Circle.sol");

contract('CircleCrowdsale', function(accounts) {

    it('should deploy the token and store the address', function(done) {
        CircleTokenCrowdsale.deployed().then(async function(instance) {
            const token = await instance.token.call();
            assert(token, 'Token address couldn\'t be stored');
            done();
        });
    });

});
