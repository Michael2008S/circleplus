pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "../contracts/Circle.sol";

contract TestCircle {

    CircleToken private _circleToken;
    address private _owner;

    function TestCircle() public {
        _owner = msg.sender;
    }

    function beforeEach() public {
        _circleToken = new CircleToken();
    }

    function test_constructor ()  public  {
    	uint allocatedTokens = _circleToken.balanceOf(this);
    	Assert.equal(allocatedTokens,20000000000,"Contract creator should hold 20,000,000,000 tokens");
    }

    function test_transfer_withValidAmount () public  {
    	_circleToken.transfer(_owner,100);
    	uint transferredTokens = _circleToken.balanceOf(_owner);
    	uint allocatedTokens = _circleToken.balanceOf(this);
    	Assert.equal(transferredTokens,100,"Recipient should hold 100 tokens");
    	Assert.equal(allocatedTokens,19999999900,"Contract creator should hold 19999999900 tokens");
    }

    function test_transfer_withInvalidAmount () public {
    	bool transferSuccessful = _circleToken.transfer(_owner,19999999901);
    	Assert.equal(transferSuccessful,false,"Address should not be able to transfeer more than allocated");
    }
    
    function test_totalSupply ()  public {
    	uint totalSupply = _circleToken.totalSupply();
    	Assert.equal(totalSupply,20000000000,"There should be 2000000000 token in circulation")
    }
    
    function test_transferForm_withInvalidAllocation ()  public {
    	_circleToken.transfer(_owner,100);
    	bool transferSuccessful =  _circleToken.transferFrom(_owner,this,100);
    	Assert.equal(transferSuccessful,false,"Unauthorised address should not be able transfer tokens");
    }
    
    function test_approve_withValidAmount () public  {
    	bool allocationSuccessful = _circleToken.approve(_owner,100);
    	Assert.equal(allocationSuccessful,true,"Token owner should be able to allocate less than or equal to their holdings");
    }
    
    function test_approve_wihtInvalidAmount () public   {
    	bool allocationSuccessful = _circleToken.approve(_owner,20000000001);
    	Assert.equal(allocationSuccessful,false,"Token owner should not be able to allocate more than their holdings");

    }

    function test_allowance_withNotAllocatedBalance() public {
    	uint allowanceAvailable = _circleToken.allowance(_owner,this);
    	Assert.equal(allowanceAvailable,0,"Spender should not have a balance available");
    }
 
 	function test_allowance_withAllocatedBalance () public   {
 		_circleToken.approve(_owner,100);
 		uint allowanceAvailable = _circleToken.allowance(_owner,this);	
 		Assert.equal(allowanceAvailable,0,"Spender should have a balance of 100 available");
 	}
 	
}
