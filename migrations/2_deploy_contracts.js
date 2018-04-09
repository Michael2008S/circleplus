var Circle = artifacts.require("./Circle.sol");
var CircleCrowdsale = artifacts.require("./CircleCrowdsale.sol");

module.exports = function(deployer) {
    // Deploying..

    deployer.deploy(Circle).then(function() {
        return deployer.deploy(
            CircleCrowdsale,
            5,
            "0x0c5b6E53Cb6128A311d999679A8ACAfFC66CC4C6",
            Circle.address
        ).then(function() {});
    });
};
