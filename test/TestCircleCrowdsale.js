var CircleTokenCrowdsale = artifacts.require("./CircleCrowdsale.sol");
var CircleToken = artifacts.require("./Circle.sol");

contract('CircleCrowdsale', function (accounts) {

    it('should deploy the token and store the address', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            const token = await instance.token.call();
            assert(token, 'Token address couldn\'t be stored');
            done();
        });
    });

    // TODO test owner,time lock,time vesting

    it('one ETH should buy 20000 Circle in _openRate', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
            await instance.investByLegalTender(accounts[7], 1e18, 2);
            const tokenAddress = await instance.token.call();
            console.log("tokenAddress:", tokenAddress);
            const circleToken = CircleToken.at(tokenAddress);
            const tokenAmount = await circleToken.balanceOf(accounts[7]);
            assert.equal(tokenAmount.toNumber(), 20000 * 1e18, 'The sender didn\'t receive the tokens as _openRate');
            done();
        });
    });


    it('one ETH should buy 60000 Circle in _angelRate,but will lock 3 month,so it get 0 Circle.', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
            await instance.investByLegalTender(accounts[6], 1e18, 0);
            const tokenAddress = await instance.token.call();
            console.log("tokenAddress:", tokenAddress);
            const circleToken = CircleToken.at(tokenAddress);
            const tokenAmount = await circleToken.balanceOf(accounts[6]);
            assert.equal(tokenAmount.toNumber(), 0 * 1e18, 'The sender should receive 0 tokens as _angelRate');
            done();
        });
    });


    it('one ETH should buy 30000 Circle in _preSaleRate', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
            await instance.investByLegalTender(accounts[5], 1e18, 1);
            const tokenAddress = await instance.token.call();
            console.log("tokenAddress:", tokenAddress);
            const circleToken = CircleToken.at(tokenAddress);
            const tokenAmount = await circleToken.balanceOf(accounts[5]);
            assert.equal(tokenAmount.toNumber(), 30000 * 1e18, 'The sender didn\'t receive the tokens as _preSaleRate');
            done();
        });
    });


    it('setReservedHolder should run right~ ', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
            await instance.setReservedHolder(accounts[2],accounts[3],accounts[4]);
            const tokenAddress = await instance.token.call();
            console.log("tokenAddress:", tokenAddress);

            const teamCircleToken = CircleToken.at(accounts[2]);
            const teamTokenAmount = await teamCircleToken.balanceOf(accounts[2]);
            assert.equal(teamTokenAmount.toNumber(), 400000000 * 1e18, 'The team token amount did not equal 400000000');

            const communityCircleToken = CircleToken.at(accounts[3]);
            const communityTokenAmount = await communityCircleToken.balanceOf(accounts[3]);
            assert.equal(communityTokenAmount.toNumber(), 400000000 * 1e18, 'The community token amount did not equal 400000000');

            const marketingCircleToken = CircleToken.at(accounts[4]);
            const marketingTokenAmount = await marketingCircleToken.balanceOf(accounts[4]);
            assert.equal(marketingTokenAmount.toNumber(), 400000000 * 1e18, 'The marketing token amount did not equal 400000000');

            done();
        });
    });


    // it('one ETH should buy 30000 Circle in _preSaleRate', function (done) {
    //     CircleTokenCrowdsale.deployed().then(async function (instance) {
    //         // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
    //         await instance.investByLegalTender(accounts[8], 1e18, 2);
    //         const tokenAddress = await instance.token.call();
    //         console.log("tokenAddress:", tokenAddress);
    //         const circleToken = CircleToken.at(tokenAddress);
    //         const tokenAmount = await circleToken.balanceOf(accounts[8]);
    //         assert.equal(tokenAmount.toNumber(), 30000 * 1e18, 'The sender didn\'t receive the tokens as _preSaleRate');
    //         done();
    //     });
    // });


});
