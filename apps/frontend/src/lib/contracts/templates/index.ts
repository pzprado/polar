import { ContractCategory, ContractTemplate } from "@/lib/types";

const tokenSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{TOKEN_NAME}} {
    string public name = "{{TOKEN_NAME}}";
    string public symbol = "{{TOKEN_SYMBOL}}";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        totalSupply = {{INITIAL_SUPPLY}} * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}`;

const nftSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{NFT_NAME}} {
    string public name = "{{NFT_NAME}}";
    string public symbol = "{{NFT_SYMBOL}}";
    string public baseURI = "{{BASE_URI}}";

    uint256 public maxSupply = {{MAX_SUPPLY}};
    uint256 public totalSupply;
    address public owner;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function balanceOf(address account) public view returns (uint256) {
        require(account != address(0), "Zero address");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token does not exist");
        return tokenOwner;
    }

    function approve(address to, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner, "Not token owner");
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(tokenOwner == from, "Invalid from address");
        require(to != address(0), "Invalid recipient");
        require(msg.sender == from || msg.sender == _tokenApprovals[tokenId], "Not authorized");

        _tokenApprovals[tokenId] = address(0);
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function mint() public onlyOwner returns (uint256) {
        require(totalSupply < maxSupply, "Max supply reached");

        uint256 tokenId = totalSupply + 1;
        totalSupply = tokenId;
        _owners[tokenId] = owner;
        _balances[owner] += 1;

        emit Transfer(address(0), owner, tokenId);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return string(abi.encodePacked(baseURI, _toString(tokenId)));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}`;

const gameSource = `// SPDX-License-Identifier: MIT
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
}`;

const tippingSource = `// SPDX-License-Identifier: MIT
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
}`;

const tokenAbi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
];

const nftAbi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  { type: "function", name: "mint", stateMutability: "nonpayable", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
];

const gameAbi = [
  { type: "function", name: "gameName", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "entryFee", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxPlayers", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "getPlayers",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address[]" }],
  },
  { type: "function", name: "join", stateMutability: "payable", inputs: [], outputs: [] },
  { type: "function", name: "pickWinner", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "getBalance", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
];

const tippingAbi = [
  { type: "function", name: "appName", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  {
    type: "function",
    name: "feePercentage",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "tip",
    stateMutability: "payable",
    inputs: [{ name: "message", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getTips",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "from", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "message", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  { type: "function", name: "withdraw", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "getBalance", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
];

export const contractTemplates: Record<ContractCategory, ContractTemplate> = {
  token: {
    id: "token",
    name: "ERC-20 Token",
    description: "A fungible token with customizable name, symbol, and initial supply",
    soliditySource: tokenSource,
    parameters: [
      {
        name: "Token Name",
        placeholder: "{{TOKEN_NAME}}",
        type: "string",
        description: "Name of the token",
        defaultValue: "MyToken",
      },
      {
        name: "Token Symbol",
        placeholder: "{{TOKEN_SYMBOL}}",
        type: "string",
        description: "Short symbol (3-5 chars)",
        defaultValue: "MTK",
      },
      {
        name: "Initial Supply",
        placeholder: "{{INITIAL_SUPPLY}}",
        type: "number",
        description: "Number of tokens to mint",
        defaultValue: "1000000",
      },
    ],
    abi: tokenAbi,
  },
  nft: {
    id: "nft",
    name: "NFT Collection",
    description: "An ERC-721 collection with owner minting and metadata",
    soliditySource: nftSource,
    parameters: [
      {
        name: "NFT Name",
        placeholder: "{{NFT_NAME}}",
        type: "string",
        description: "Name of the collection",
        defaultValue: "PixelPals",
      },
      {
        name: "NFT Symbol",
        placeholder: "{{NFT_SYMBOL}}",
        type: "string",
        description: "Collection symbol",
        defaultValue: "PXP",
      },
      {
        name: "Max Supply",
        placeholder: "{{MAX_SUPPLY}}",
        type: "number",
        description: "Maximum number of NFTs",
        defaultValue: "100",
      },
      {
        name: "Base URI",
        placeholder: "{{BASE_URI}}",
        type: "string",
        description: "Base metadata URI",
        defaultValue: "https://example.com/metadata/",
      },
    ],
    abi: nftAbi,
  },
  game: {
    id: "game",
    name: "On-Chain Game",
    description: "A simple on-chain betting game",
    soliditySource: gameSource,
    parameters: [
      {
        name: "Game Name",
        placeholder: "{{GAME_NAME}}",
        type: "string",
        description: "Name of the game contract",
        defaultValue: "CoinFlip",
      },
      {
        name: "Entry Fee",
        placeholder: "{{ENTRY_FEE}}",
        type: "number",
        description: "Entry fee in wei",
        defaultValue: "100000000000000000",
      },
      {
        name: "Max Players",
        placeholder: "{{MAX_PLAYERS}}",
        type: "number",
        description: "Maximum players per round",
        defaultValue: "10",
      },
    ],
    abi: gameAbi,
  },
  tipping: {
    id: "tipping",
    name: "Tipping / Payments",
    description: "A payable tipping contract with fee split",
    soliditySource: tippingSource,
    parameters: [
      {
        name: "App Name",
        placeholder: "{{APP_NAME}}",
        type: "string",
        description: "Name of the tipping app",
        defaultValue: "TipJar",
      },
      {
        name: "Fee Percentage",
        placeholder: "{{FEE_PERCENTAGE}}",
        type: "number",
        description: "Platform fee percentage",
        defaultValue: "5",
      },
    ],
    abi: tippingAbi,
  },
};

export function fillTemplate(templateId: ContractCategory, params: Record<string, string>): string {
  const template = contractTemplates[templateId];
  let source = template.soliditySource;

  for (const parameter of template.parameters) {
    const value = params[parameter.placeholder] ?? parameter.defaultValue ?? "";
    source = source.replaceAll(parameter.placeholder, value);
  }

  return source;
}
