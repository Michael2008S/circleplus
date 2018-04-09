var Circle = artifacts.require("./Circle.sol");
var CircleCrowdsale = artifacts.require("./CircleCrowdsale.sol");

module.exports = function(deployer) {
    // Deploying..

  // deployer.deploy(SafeMath);
  // deployer.link(SafeMath, Circle);
  // deployer.deploy(Addresses);
  // deployer.link(Addresses, Circle);

    deployer.deploy(Circle).then(function() {
        return deployer.deploy(
            CircleCrowdsale,
            Circle.address,
            web3.eth.blockNumber,
            web3.eth.blockNumber + 1000,
            web3.toWei(1, 'ether'),
            1
        ).then(function() {});
    });
};