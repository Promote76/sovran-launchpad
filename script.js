
// Enhanced script.js with wallet detection, balance fetch, transaction, and signature
const connectButton = document.getElementById("connectWallet");
const contributeButton = document.getElementById("contributeBtn");
const balanceDisplay = document.getElementById("walletBalance");
const tokenSelect = document.getElementById("tokenSelect");

let currentAccount;
let provider;
let signer;

const tokenAddresses = {
  WBNB: "0x3E14602186DD9dE538F729547B3918D24c823546",
  WXRP: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
  WETH: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  WBTC: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c"
};

const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    currentAccount = await signer.getAddress();
    connectButton.innerText = "Wallet Connected";
    fetchBalance();
  } else {
    alert("MetaMask not detected.");
  }
}

async function fetchBalance() {
  const selectedToken = tokenSelect.value;
  const tokenAddress = tokenAddresses[selectedToken];
  const contract = new ethers.Contract(tokenAddress, tokenABI, provider);
  const balance = await contract.balanceOf(currentAccount);
  balanceDisplay.innerText = `Balance: ${ethers.utils.formatUnits(balance, 18)} ${selectedToken}`;
}

async function contribute() {
  const amount = document.getElementById("contributionAmount").value;
  const selectedToken = tokenSelect.value;
  const tokenAddress = tokenAddresses[selectedToken];
  const contract = new ethers.Contract(tokenAddress, tokenABI, signer);
  const tx = await contract.transfer("0xYourLaunchpadContractAddress", ethers.utils.parseUnits(amount, 18));
  await tx.wait();
  alert("Contribution Successful!");
  fetchBalance();
}

connectButton.addEventListener("click", connectWallet);
contributeButton.addEventListener("click", contribute);
tokenSelect.addEventListener("change", fetchBalance);
