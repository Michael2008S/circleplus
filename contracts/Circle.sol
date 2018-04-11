pragma solidity ^0.4.18;

import "./zeppelin/token/ERC20/MintableToken.sol";

contract Circle is MintableToken {
    string public name = "Circle Plus";
    string public symbol = "Circle";
    uint8 public decimals = 18;
}
