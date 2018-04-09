var CircleCrowdsale = artifacts.require("./CircleCrowdsale.sol");
var CircleToken = artifacts.require("./Circle.sol");

contract('CircleCrowdsale', (accounts) => {

    var creatorAddress = accounts[0];
    var recipientAddress = accounts[1];

    var crowdsaleAddress;
    CircleCrowdsale.deployed().then(instance => {
        crowdsaleAddress = instance.address;
    });

    var cirecleTokenAddress;
    CircleToken.deployed().then(instance => {
        cirecleTokenAddress = instance.address;
    });

    it("should transfer 1000 CircleToken to the crowdsale balance", () => {
        var circleTokenInstance;
        return CircleToken.deployed().then(instance => {
            circleTokenInstance = instance;
            return circleTokenInstance.transfer(crowdsaleAddress, 1000, {
                from: creatorAddress
            });
        }).then(result => {
            return circleTokenInstance.balanceOf.call(crowdsaleAddress);
        }).then(crowdsaleBalance => {
            assert.equal(crowdsaleBalance.valueOf(), 1000, "1000 wasn't in the crowdsale balance");
        });
    });

    it("shoule have a crowdsale balance of 1000",() => {
    	return CircleCrowdsale.deployed().then(instance => {
    		return instance.availableBalance.call();
    	}).then(availableBalance =>{
    		assert.equal(availableBalance.valueOf(),1000,"1000 wasn't the available crowsale balance");
    	});
    });

    it("should transfer 1 token to the creator address",()=>{
    	var circleCrowdsaleInstance;
    	return CircleCrowdsale.deployed().then(instance =>{
    		circleTokenInstance = instance;
    		return circleTokenInstance.buy({from:creatorAddress,value: web3.toWei(1,'ether')});
    	}).then(result =>{
    		return circleTokenInstance.availableBalance.call();
    	}).then(availableBalance => {
    		assert.equal(availableBalance.valueOf(),999,"999 wasn't in the creator balance");
    	});
    });


    it("should contain 9001 CircleToken in the creator balance", () =>{
    	return CircleToken.deployed().then(instance => {
    		return instance.balanceOf.call(creatorAddress);
    	}).then(balance => {
    		assert.equal(balance.valueOf(),9001,"9001 wasn't in the creator balance");
    	})
    });

    it("should thansfer 1 token to the recipient address",()=>{
    	var circleCrowdsaleInstance;
    	return CircleCrowdsale.deployed().then(instance => {
    		circleTokenInstance = instance;
    		return circleTokenInstance.buyFor(recipientAddress,{from:creatorAddress,value: web3.toWei(1,'ether')});
    	}).then(result => {
    		return circleTokenInstance.availableBalance.call();
    	}).then(availableBalance =>{
    		assert.equal(availableBalance.valueOf(),998,"998 wasn't the available crowdsale balance");
    	});
    });

    it("should contain 1 CircleToken in the recipient balance",()=>{
    	return CircleToken.deployed().then(instance => {
    		return instance.balanceOf.call(recipientAddress);
    	}).then(balance => {
    		assert.equal(balance.valueOf(),1,"1 wasn't in the recipient balance");
    	});
    });

});