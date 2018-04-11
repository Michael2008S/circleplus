var CircleToken = artifacts.require("./Circle.sol");

contract('Circle',(accounts) => {
	var creatorAddress = accounts[0];
	var recipientAddress = accounts[1];
	var delegatedAddress = accounts[2];

	// it("should contain 20,000,000,000 Circle in circulation",() => {
	// 	return CircleToken.deployed().then((instance) => {
	// 		return instance.totalSupply.call();
	// 	}).then(balance => {
	// 		assert.equal(balance.valueOf(),20000000000,"20,000,000,000 Circle Token are not in circulation");
	// 	});
	// });
});
