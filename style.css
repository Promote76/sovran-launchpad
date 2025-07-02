// script.js - Fully Enhanced Version

let web3; let userAccount; const connectBtn = document.getElementById("connectBtn"); const contributeBtn = document.getElementById("contributeBtn"); const walletAddressDisplay = document.getElementById("walletAddress"); const tokenSelect = document.getElementById("tokenSelect"); const amountInput = document.getElementById("amountInput"); const walletBalanceDisplay = document.getElementById("walletBalance");

window.addEventListener("load", async () => { if (typeof window.ethereum !== "undefined") { web3 = new Web3(window.ethereum);

// Auto-reconnect wallet if previously connected
const previouslyConnected = localStorage.getItem("walletConnected");
if (previouslyConnected) {
  await connectWallet();
}

// Detect chain and warn if not BSC (Chain ID: 56)
const chainId = await web3.eth.getChainId();
if (chainId !== 56) {
  alert("Please switch your network to Binance Smart Chain (BSC)");
}

} else { alert("MetaMask or a compatible wallet is not installed."); } });

connectBtn.addEventListener("click", async () => { await connectWallet(); });

async function connectWallet() { try { const accounts = await window.ethereum.request({ method: "eth_requestAccounts", }); userAccount = accounts[0]; displayWalletAddress(userAccount); await updateWalletBalance(); connectBtn.innerText = "Wallet Connected"; connectBtn.disabled = true; localStorage.setItem("walletConnected", true); } catch (error) { console.error("Wallet connection error:", error); alert("Wallet connection was cancelled or failed."); } }

function displayWalletAddress(address) { const shortAddress = ${address.substring(0, 6)}...${address.slice(-4)}; walletAddressDisplay.innerText = shortAddress; walletAddressDisplay.style.display = "block"; }

async function updateWalletBalance() { const balance = await web3.eth.getBalance(userAccount); const formatted = web3.utils.fromWei(balance, "ether"); walletBalanceDisplay.innerText = ${formatted} BNB; }

contributeBtn.addEventListener("click", async () => { if (!userAccount) { alert("Please connect your wallet first."); return; }

const selectedToken = tokenSelect.value; const amount = amountInput.value;

if (!amount || isNaN(amount) || Number(amount) <= 0) { alert("Please enter a valid contribution amount."); return; }

const amountInWei = web3.utils.toWei(amount, "ether");

try { const tx = await web3.eth.sendTransaction({ from: userAccount, to: "0xYourContractAddressHere", // Replace with your contract value: amountInWei, });

alert("Contribution successful! TxHash: " + tx.transactionHash);

} catch (error) { console.error("Contribution error:", error); alert("Transaction failed or was cancelled."); } });

// Disconnect wallet manually function disconnectWallet() { userAccount = null; localStorage.removeItem("walletConnected"); walletAddressDisplay.innerText = ""; connectBtn.innerText = "Connect Wallet"; connectBtn.disabled = false; walletBalanceDisplay.innerText = "Connect wallet to see balance."; }

