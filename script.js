const launchpadAddress = "0x0C0bfd4E4170411bc9665A368FaFaB3048883C4C"; // Replace with your deployed contract if changed

const tokenAddresses = {
  WBNB: "0x3E14602186DD9dE538F729547B3918D24c823546",
  WXRP: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
  WETH: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  WBTC: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c"
};

let provider;
let signer;
let userAddress;

window.onload = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("connectBtn").addEventListener("click", connectWallet);
    document.getElementById("contributeForm").addEventListener("submit", contribute);
  } else {
    alert("Please install MetaMask to use this dApp.");
  }
};

async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("connectBtn").innerText = `Connected: ${userAddress.slice(0, 6)}...`;
  } catch (err) {
    console.error("Wallet Connection Error:", err);
  }
}

async function contribute(e) {
  e.preventDefault();

  const token = document.getElementById("token").value;
  const amountEth = document.getElementById("amount").value;

  if (!signer || !userAddress) {
    return alert("Please connect your wallet first.");
  }

  if (!tokenAddresses[token]) {
    return alert("Unsupported token selected.");
  }

  try {
    const tokenAddress = tokenAddresses[token];
    const erc20 = new ethers.Contract(tokenAddress, [
      "function decimals() view returns (uint8)",
      "function allowance(address, address) view returns (uint256)",
      "function approve(address, uint256) returns (bool)",
      "function transferFrom(address, address, uint256) returns (bool)"
    ], signer);

    const decimals = await erc20.decimals();
    const amount = ethers.utils.parseUnits(amountEth, decimals);

    // Check and approve token spending
    const allowance = await erc20.allowance(userAddress, launchpadAddress);
    if (allowance.lt(amount)) {
      const tx = await erc20.approve(launchpadAddress, ethers.constants.MaxUint256);
      await tx.wait();
    }

    const launchpad = new ethers.Contract(launchpadAddress, [
      "function contribute(address token, uint256 amount) public"
    ], signer);

    const tx = await launchpad.contribute(tokenAddress, amount);
    await tx.wait();

    alert("Contribution successful!");
    document.getElementById("contributeForm").reset();
  } catch (err) {
    console.error(err);
    alert("Contribution failed. Check the console for details.");
  }
}
