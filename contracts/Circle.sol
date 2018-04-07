pragma solidity ^0.4.18;

import "./zeppelin/token/ERC20/BurnableToken.sol";
import "./zeppelin/token/ERC20/MintableToken.sol";


contract Circle is MintableToken, BurnableToken {
    string public name = "CirclePlus";
    string public symbol = "Circle";
    uint256 public decimals = 18;
    uint256 public maxSupply = 20000000000 * (10 ** decimals);

    function Circle(){

    }

    modifier canTransfer(address _from, uint _value) {
        require(mintingFinished);
        _;
    }

    function transfer(address _to, uint _value) canTransfer(msg.sender, _value) public returns (bool) {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint _value) canTransfer(_from, _value) public returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }
}
