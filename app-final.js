
const launchpadAddress = "0x0C0bfd4E4170411bc9665A368FaFaB3048883C4C";
const ABI = [{"inputs": [{"internalType": "address", "name": "_treasuryAddress", "type": "address"}, {"internalType": "address", "name": "_admin", "type": "address"}], "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "newAdmin", "type": "address"}], "name": "AdminChanged", "type": "event"}];

let web3, provider, contract, selectedAccount;

// Token addresses by symbol
const tokens = {
  WBNB: "0x3E14602186DD9dE538F729547B3918D24c823546",
  WXRP: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
  WETH: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  WBTC: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c"
};

// Load WalletConnect provider fallback
async function connectWallet() {
  if (window.ethereum) {
    provider = window.ethereum;
    web3 = new Web3(provider);
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    selectedAccount = accounts[0];
  } else {
    provider = new WalletConnectProvider.default({
      rpc: {
        56: "https://bsc-dataseed.binance.org/"
      },
      chainId: 56
    });
    await provider.enable();
    web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];
  }

  contract = new web3.eth.Contract(ABI, launchpadAddress);
  document.getElementById("walletInfo").innerText = `Connected: ${selectedAccount}`;
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);

document.getElementById("contribute").addEventListener("click", async () => {
  const tokenSymbol = document.getElementById("token").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const feedback = document.getElementById("feedback");

  if (!web3 || !selectedAccount || !contract) {
    feedback.innerText = "❌ Wallet not connected.";
    return;
  }

  try {
    const tokenAddress = tokens[tokenSymbol];
    const tokenContract = new web3.eth.Contract([
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }]
      }
    ], tokenAddress);

    const decimals = await tokenContract.methods.decimals().call();
    const amountInWei = web3.utils.toBN(amount * 10 ** decimals);

    feedback.innerText = "Approving token...";
    await tokenContract.methods
      .approve(launchpadAddress, amountInWei)
      .send({ from: selectedAccount });

    feedback.innerText = "Sending contribution...";
    await contract.methods
      .contribute(tokenAddress, amountInWei)
      .send({ from: selectedAccount });

    feedback.innerText = "✅ Contribution successful!";
  } catch (error) {
    console.error(error);
    feedback.innerText = "❌ Transaction failed.";
  }
});
