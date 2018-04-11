var Circle = artifacts.require("./Circle.sol");
var CircleCrowdsale = artifacts.require("./CircleCrowdsale.sol");

module.exports = function (deployer) {
    // Deploying..

    // starttime must bigger than block time.

    const startTime = Math.round((new Date(Date.now() + 86400000).getTime()) / 1000); // Tommrrow
    const endTime = Math.round((new Date().getTime() + (86400000 * 20)) / 1000); // Today + 20 days

    // deployer.deploy(Circle).then(function() {
    //     return deployer.deploy(
    //         CircleCrowdsale,
    //         startTime,
    //         endTime,
    //         5,
    //         "0x0c5b6E53Cb6128A311d999679A8ACAfFC66CC4C6",
    //         Circle.address
    //     ).then(function() {});
    // });

    deployer.deploy(
        CircleCrowdsale,
        // startTime,
        // endTime,
        20000,
        "0x70D46b39f41d0EC0B10Ce8adD2C6cA81e23ec779"
    ).then(function () {
    });

};
