pragma solidity ^0.4.18;

library Addresses {
    function isContract(address _base) internal constant returns (bool) {
        uint codeSize;
        assembly {
            condeSize := extcodesize(_base)
        }
        return codeSize > 0;
    }
}
