// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{GAME_NAME}} {
    string public gameName = "{{GAME_NAME}}";
    uint256 public entryFee = {{ENTRY_FEE}};
    uint256 public maxPlayers = {{MAX_PLAYERS}};
    uint256 public round = 1;

    address[] private players;

    event PlayerJoined(address indexed player, uint256 totalPlayers, uint256 indexed round);
    event WinnerPicked(address indexed winner, uint256 amount, uint256 indexed round);

    function join() external payable {
        require(msg.value == entryFee, "Incorrect entry fee");
        require(players.length < maxPlayers, "Round is full");

        players.push(msg.sender);
        emit PlayerJoined(msg.sender, players.length, round);

        if (players.length == maxPlayers) {
            pickWinner();
        }
    }

    function pickWinner() public {
        require(players.length > 1, "Need at least 2 players");

        uint256 winnerIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players.length, round))
        ) % players.length;

        address winner = players[winnerIndex];
        uint256 amount = address(this).balance;

        (bool sent, ) = winner.call{value: amount}("");
        require(sent, "Prize transfer failed");

        emit WinnerPicked(winner, amount, round);

        delete players;
        round += 1;
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
