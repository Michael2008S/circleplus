pragma solidity ^0.4.18;

import "./Circle.sol";
import "./zeppelin/crowdsale/validation/CappedCrowdsale.sol";

contract CircleCrowdsale is CappedCrowdsale {

    // Crowdsale Stage
    // ============
    enum CrowdsaleStage {
        AngelRound,
        PreSaleRound,
        OpenRound}

    // Token Distribution
    // =============================
    uint256 public totalSupplyMax = 20000000000 * (10 ** 18); // There will be total 20,000,000,000 Circle Tokens

    uint256 public angelRound = 100000000 * (10 ** 18);   // Angel Investors 100,000,000 (10%)
    uint256 public preSaleRound = 400000000 * (10 ** 18);   // PreSale Round 400,000,000 (10%)
    uint256 public openRound = 100000000 * (10 ** 18);   // Open Round 100,000,000 (10%)

    uint256 public teamFund = 400000000 * (10 ** 18);   // Team/Foundation 400,000,000 (20%) cliff 6mon
    uint256 public communityFund = 400000000 * (10 ** 18);   // Community 400,000,000 (20%)
    uint256 public marketingFund = 400000000 * (10 ** 18);   // Marketing 400,000,000 (20%)
    // ==============================

    // Stage Rate
    // ============
    uint256 private _angelRate = 60000;
    uint256 private _preSaleRate = 30000;
    uint256 private _openRate = 20000;
    // ============

    // angel locked tokens
    TokenTimelock public angelTimeLock;

    // team vesting
    uint256 public constant TEAM_VESTING_CLIFF = 30*6 days;
    uint256 public constant TEAM_VESTING_DURATION = 2 years;

    // Constructor
    // ============
    function CircleCrowdsale(uint256 _rate, address _wallet, uint256 _goal, uint256 _cap)
    CappedCrowdsale(_cap)
    FinalizableCrowdsale()
    Crowdsale(_rate, _wallet)
    public {
        require(_goal <= _cap);
    }
    // =============


    // Token Deployment
    // =================
    function createTokenContract() internal returns (MintableToken) {
        return new Circle();
        // Deploys the ERC20 token. Automatically called when crowdsale contract is deployed
    }
    // ==================


    function() external payable {
        revert();
    }

    function investByLegalTender(address _beneficiary, uint256 _value, uint _stage) external {

        if (stage == CrowdsaleStage.AngelRound) {
            // give tokens to angel with lock 90 days
            angelTimeLock = new TokenTimelock(token, _beneficiary, uint64(now + 90 days));
            token.mint(angelTimeLock, _angelRate * _value);
        } else if (stage == CrowdsaleStage.PreSaleRound) {
            token.mint(_beneficiary, _preSaleRate * _value);
        } else if (stage == CrowdsaleStage.OpenRound) {
            token.mint(_beneficiary, _openRate * _value);
        }
    }

    // Finish: Mint Extra Tokens as needed before finalizing the Crowdsale.
    // ====================================================================
    function setReservedHolder(address _teamFundWallet, address _communityFundWallet, address _marketingFundWallet){
        uint256 alreadyMinted = token.totalSupply();
        require(alreadyMinted < maxTokens);

        TokenVesting _teamTokenVesting = new TokenVesting(_teamFundWallet, now, TEAM_VESTING_CLIFF, TEAM_VESTING_DURATION, true);
        token.mint(_teamFundWallet, teamFund);
        token.mint(_communityFundWallet, communityFund);
        token.mint(_marketingFundWallet, marketingFund);

        // TODO remind token to another wallet

    }
    // ===============================


    // REMOVE THIS FUNCTION ONCE YOU ARE READY FOR PRODUCTION
    // USEFUL FOR TESTING `finish()` FUNCTION
    function hasEnded() public view returns (bool) {
        return true;
    }
}
