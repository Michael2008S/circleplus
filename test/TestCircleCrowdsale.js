var CircleTokenCrowdsale = artifacts.require("./CircleCrowdsale.sol");
var CircleToken = artifacts.require("./Circle.sol");

var TokenTimelock = artifacts.require("./zeppelin/token/ERC20/TokenTimelock.sol");
var TokenVesting = artifacts.require("./zeppelin/token/ERC20/TokenVesting.sol");


contract('CircleCrowdsale', function (accounts) {

    it('should deploy the token and store the address', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            const token = await instance.token.call();
            assert(token, 'Token address couldn\'t be stored');
            done();
        });
    });

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


    it('_angelRate,but will lock 3 month,so it get 0 Circle.', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
            await instance.setAngelHolder(accounts[4]);
            const tokenAddress = await instance.token.call();
            console.log("tokenAddress:", tokenAddress);
            const circleToken = CircleToken.at(tokenAddress);
            const tokenAmount = await circleToken.balanceOf(accounts[4]);
            assert.equal(tokenAmount.toNumber(), 0 * 1e18, 'The sender should receive 0 tokens as _angelRate');

            // angelTimeLock =
            timeLockAddress = await instance.angelTimeLock.call();
            timelockInstance = TokenTimelock.at(timeLockAddress);
            timelock_beneficiary = await timelockInstance.beneficiary();
            console.log("timelock_release:", timelock_beneficiary);
            assert.equal(timelock_beneficiary, accounts[4], 'The timelock_beneficiary equal what I set.');

            console.log("timelock_releaseTime:", await timelockInstance.releaseTime());
            timelock_balance = await circleToken.balanceOf(timeLockAddress);
            console.log("timelock_release:", timelock_balance);
            assert.equal(timelock_balance, 200000000 * 1e18, 'The timelock_balance equal 200000000 * 1e18.');

            console.log("timelock_addr:", timeLockAddress);

            // console.log("timelock_release:",await timelockInstance.release());

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
            await instance.setReservedHolder(accounts[1], accounts[2], accounts[3]);
            const tokenAddress = await instance.token.call();

            const circleTokenInstance = CircleToken.at(tokenAddress);

            const totalSupply = await circleTokenInstance.totalSupply();
            console.log("totalSupply:", totalSupply);
            console.log("tokenAddress:", tokenAddress);


            // TODO test vesting
            const teamTokenAmount = await circleTokenInstance.balanceOf(accounts[1]);
            assert.equal(teamTokenAmount.toNumber(), 0 * 1e18, 'The team vesting token amount did not equal 0');

            // angelTimeLock =
            timeVestingAddress = await instance.teamTokenVesting.call();
            timeVestingInstance = TokenVesting.at(timeVestingAddress);
            console.log("timeVesting_release-->:", await timeVestingInstance.beneficiary());
            console.log("timeVesting_release-->:", await timeVestingInstance.start());
            console.log("timeVesting_release-->:", await timeVestingInstance.cliff());
            console.log("timeVesting_release-->:", await timeVestingInstance.duration());
            console.log("timeVesting_release-->:", await timeVestingInstance.revocable());
            console.log("timeVesting_addr-->:", timeVestingAddress);
            console.log("timeVesting_release-->:", await circleTokenInstance.balanceOf(timeVestingAddress));

            const communityCircleToken = CircleToken.at(tokenAddress);
            const communityTokenAmount = await communityCircleToken.balanceOf(accounts[2]);
            assert.equal(communityTokenAmount.toNumber(), 400000000 * 1e18, 'The community token amount did not equal 400000000');

            const marketingCircleToken = CircleToken.at(tokenAddress);
            const marketingTokenAmount = await marketingCircleToken.balanceOf(accounts[3]);
            assert.equal(marketingTokenAmount.toNumber(), 400000000 * 1e18, 'The marketing token amount did not equal 400000000');

            done();
        });
    });


    it('setReservedHolder should run right~ ', function (done) {
        CircleTokenCrowdsale.deployed().then(async function (instance) {
            // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
            await instance.setReservedHolder(accounts[1], accounts[2], accounts[3]);
            const tokenAddress = await instance.token.call();

            const circleTokenInstance = CircleToken.at(tokenAddress);

            const totalSupply = await circleTokenInstance.totalSupply();
            console.log("totalSupply:", totalSupply);

            console.log("totalTokenMintedAngel:", await instance.totalTokenMintedAngel());
            console.log("totalTokenMintedPreSale:", await instance.totalTokenMintedPreSale());
            console.log("totalTokenMintedOpen:", await instance.totalTokenMintedOpen());

            console.log("totalTeamFundMinted:", await instance.totalTeamFundMinted());
            console.log("totalCommunityFundMinted:", await instance.totalCommunityFundMinted());
            console.log("totalMarketingFundMinted:", await instance.totalMarketingFundMinted());


            console.log("circleTokenInstance.name:", await circleTokenInstance.name());
            console.log("circleTokenInstance.symbol:", await circleTokenInstance.symbol());
            console.log("circleTokenInstance.decimals:", await circleTokenInstance.decimals());
            console.log("circleTokenInstance.owner:", await circleTokenInstance.owner());
            console.log("CircleTokenCrowdsale.owner:", await instance.owner());

            console.log("tokenAddress:", tokenAddress);

            // TODO test vesting
            const teamTokenAmount = await circleTokenInstance.balanceOf(accounts[1]);
            assert.equal(teamTokenAmount.toNumber(), 0 * 1e18, 'The team vesting token amount did not equal 0');

            const communityCircleToken = CircleToken.at(tokenAddress);
            const communityTokenAmount = await communityCircleToken.balanceOf(accounts[2]);
            assert.equal(communityTokenAmount.toNumber(), 400000000 * 1e18, 'The community token amount did not equal 400000000');

            const marketingCircleToken = CircleToken.at(tokenAddress);
            const marketingTokenAmount = await marketingCircleToken.balanceOf(accounts[3]);
            assert.equal(marketingTokenAmount.toNumber(), 400000000 * 1e18, 'The marketing token amount did not equal 400000000');

            done();
        });
    });


    // it('setReservedHolder should run right~ ', function (done) {
    //     CircleTokenCrowdsale.deployed().then(async function (instance) {
    //         // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
    //         await instance.setRemindHolder(accounts[4]);
    //         const tokenAddress = await instance.token.call();
    //
    //         const circleTokenInstance = CircleToken.at(tokenAddress);
    //
    //         const totalSupply = await circleTokenInstance.totalSupply();
    //         console.log("totalSupply:", totalSupply);
    //         console.log("tokenAddress:", tokenAddress);
    //
    //         const communityCircleToken = CircleToken.at(tokenAddress);
    //         const communityTokenAmount = await communityCircleToken.balanceOf(accounts[4]);
    //         // assert.equal(communityTokenAmount.toNumber(), 0 * 1e18, 'The remind token ~');
    //         done();
    //     });
    // });


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
