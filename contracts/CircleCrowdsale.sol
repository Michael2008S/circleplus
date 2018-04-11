pragma solidity ^0.4.18;

import "./Circle.sol";
import "./zeppelin/crowdsale/Crowdsale.sol";
import "./zeppelin/ownership/Ownable.sol";
import "./zeppelin/crowdsale/emission/MintedCrowdsale.sol";
import "./zeppelin/crowdsale/validation/TimedCrowdsale.sol";
import "./zeppelin/crowdsale/distribution/FinalizableCrowdsale.sol";
import "./zeppelin/token/ERC20/TokenTimelock.sol";
import "./zeppelin/token/ERC20/TokenVesting.sol";

contract CircleCrowdsale is Ownable, MintedCrowdsale {

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
    uint256 public preSaleRound = 400000000 * (10 ** 18);   // PreSale Round 400,000,000 (20%)
    uint256 public openRound = 100000000 * (10 ** 18);   // Open Round 100,000,000 (10%)

    uint256 public teamFund = 400000000 * (10 ** 18);   // Team/Foundation 400,000,000 (20%) cliff 6mon
    uint256 public communityFund = 400000000 * (10 ** 18);   // Community 400,000,000 (20%)
    uint256 public marketingFund = 400000000 * (10 ** 18);   // Marketing 400,000,000 (20%)
    // ==============================

    // Amount minted in Every Stage
    // ==================
    uint256 public totalTokenMintedAngel;
    uint256 public totalTokenMintedPreSale;
    uint256 public totalTokenMintedOpen;

    uint256 public totalTeamFundMinted;
    uint256 public totalCommunityFundMinted;
    uint256 public totalMarketingFundMinted;

    // ===================

    // Stage Rate
    // ============
    uint256 private _angelRate = 60000;
    uint256 private _preSaleRate = 30000;
    uint256 private _openRate = 20000;
    // ============

    // angel locked tokens
    TokenTimelock public angelTimeLock;

    // team vesting
    uint256 public constant TEAM_VESTING_CLIFF = 30 * 6 days;
    uint256 public constant TEAM_VESTING_DURATION = 2 years;

    ERC20 _token = new Circle();

    // Constructor
    // ============
    function CircleCrowdsale(uint256 _rate, address _wallet) public
    Crowdsale(_rate, _wallet, _token)
    {
    }
    // =============

    function() external payable {
        revert();
    }

    function investByLegalTender(address _beneficiary, uint256 _value, uint _stage) onlyOwner external returns (bool)  {
        uint256 _amount;
        if (_stage == uint(CrowdsaleStage.AngelRound)) {
            _amount = _angelRate * _value;
            if (totalTokenMintedAngel + _amount > angelRound) {
                return false;
            }
            // give tokens to angel with lock 90 days
            angelTimeLock = new TokenTimelock(token, _beneficiary, uint64(now + 90 days));
            MintableToken(token).mint(angelTimeLock, _amount);
            totalTokenMintedAngel += _amount;
        } else if (_stage == uint(CrowdsaleStage.PreSaleRound)) {
            _amount = _preSaleRate * _value;
            if (totalTokenMintedPreSale + _amount > preSaleRound) {
                return false;
            }
            MintableToken(token).mint(_beneficiary, _amount);
            totalTokenMintedPreSale += _amount;
        } else if (_stage == uint(CrowdsaleStage.OpenRound)) {

            _amount = _openRate * _value;
            if (totalTokenMintedOpen + _amount > preSaleRound) {
                return false;
            }

            MintableToken(token).mint(_beneficiary, _amount);
            totalTokenMintedOpen += _amount;
        }

        return true;
    }

    function setReservedHolder(address _teamFundWallet, address _communityFundWallet, address _marketingFundWallet) onlyOwner external {
        if (teamFund - totalTeamFundMinted > 0) {
            TokenVesting _teamTokenVesting = new TokenVesting(_teamFundWallet, now, TEAM_VESTING_CLIFF, TEAM_VESTING_DURATION, true);
            MintableToken(token).mint(_teamTokenVesting, teamFund - totalTeamFundMinted);
            totalTeamFundMinted = teamFund - totalTeamFundMinted;
        }

        if (communityFund - totalCommunityFundMinted > 0) {
            MintableToken(token).mint(_communityFundWallet, communityFund - totalCommunityFundMinted);
            totalCommunityFundMinted += communityFund - totalCommunityFundMinted;
        }
        if (marketingFund - totalMarketingFundMinted > 0) {
            MintableToken(token).mint(_marketingFundWallet, marketingFund - totalMarketingFundMinted);
            totalMarketingFundMinted += marketingFund - totalMarketingFundMinted;
        }
    }

}
