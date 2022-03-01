// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract PondToken {

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    string public constant name = "Pond";
    string public constant symbol = "POND";
    uint8 public constant decimals = 18;

    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalSupply_;

    constructor(uint256 total) {
      totalSupply_ = total;
      balances[msg.sender] = totalSupply_;
    }

    function getMsgSender() public view returns(address) {
        return msg.sender;
    }

    function totalSupply() public view returns (uint256) {
      return totalSupply_;
    }

    function balanceOf(address tokenOwner) public view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] -= numTokens;
        balances[receiver] += numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] -= numTokens;
        allowed[owner][msg.sender] -= numTokens;
        balances[buyer] += numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}

contract Farming {

  string public name = "Farm";
  string public constant symbol = "FARM";
    uint8 public constant decimals = 18;
  address public owner;
  PondToken public pondToken;

  // address public rewardAddress;
  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  
  //Events
  event UserAcctDebited(address _sourcedebitacct, uint _amount);
  event FailedAcctDebited(address _sourcedebitacct, uint _amount);

  constructor(PondToken _pondToken) {
    pondToken = _pondToken;
    owner = msg.sender;
  }

  //Deposit Tokens from a specific wallet address and into this address
  function stakeTokens(address _sourcedebitacct, uint _amount) public {
    require(_amount > 0, "amount cannot be 0");
    bool isapprove = pondToken.approve(_sourcedebitacct, _amount);
    if(isapprove) {
      pondToken.transferFrom(_sourcedebitacct, address(this), _amount);
      emit UserAcctDebited(_sourcedebitacct, _amount);
    }
    else {
      emit FailedAcctDebited(_sourcedebitacct, _amount);
    }
  }

  // Withdraw Tokens
  //Users unstake their tokens and get reward tokens too.
  function unstakeTokens() public {
    
    //require(balance > 0, "Staking Balance cannot be 0.");
    //pondToken.transfer(msg.sender, balance + reward);
    // pondToken.transferFrom(rewardAddress, msg.sender, reward);
    
  }

  /*
  * Issuing Tokens.  Where this.address and other approved address can transfer X amount of PondToken
  * from an address that is in the staked mapping
  */
  function issueTokens() public {
    require(msg.sender == owner, "not owner");
    
  }

  
}
