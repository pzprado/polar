// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{APP_NAME}} {
    struct TipRecord {
        address from;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    string public appName = "{{APP_NAME}}";
    uint256 public feePercentage = {{FEE_PERCENTAGE}};
    address public owner;

    TipRecord[] private tips;

    event TipReceived(address indexed from, uint256 amount, string message, uint256 timestamp);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function tip(string calldata message) external payable {
        require(msg.value > 0, "Tip must be greater than zero");

        uint256 fee = (msg.value * feePercentage) / 100;
        uint256 payout = msg.value - fee;

        (bool sent, ) = owner.call{value: payout}("");
        require(sent, "Owner payout failed");

        tips.push(TipRecord(msg.sender, msg.value, message, block.timestamp));
        emit TipReceived(msg.sender, msg.value, message, block.timestamp);
    }

    function getTips() external view returns (TipRecord[] memory) {
        return tips;
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance to withdraw");

        (bool sent, ) = owner.call{value: amount}("");
        require(sent, "Withdraw failed");

        emit Withdrawn(owner, amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
