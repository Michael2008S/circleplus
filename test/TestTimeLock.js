//
// import latestTime from './helpers/latestTime';
// import { increaseTimeTo, duration } from './helpers/increaseTime';



//
//
//
// it('one ETH should buy 60000 Circle in _angelRate,but will lock 3 month,so it get 0 Circle.', function (done) {
//     CircleTokenCrowdsale.deployed().then(async function (instance) {
//         // const data = await instance.sendTransaction({from: accounts[7], value: web3.toWei(1, "ether")});
//         await instance.investByLegalTender(accounts[6], 1e18, 0);
//         const tokenAddress = await instance.token.call();
//         console.log("tokenAddress:", tokenAddress);
//         const circleToken = CircleToken.at(tokenAddress);
//         const tokenAmount = await circleToken.balanceOf(accounts[6]);
//         assert.equal(tokenAmount.toNumber(), 0 * 1e18, 'The sender should receive 0 tokens as _angelRate');
//
//         await instance.angelTimeLock.release().should.be.rejected;
//
//
//         done();
//     });
// });
