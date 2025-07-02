const launchpadAddress = "0x0C0bfd4E4170411bc9665A368FaFaB3048883C4C";
const ABI = []; // Insert full ABI here

let contract, selectedAccount;

document.getElementById("connectWallet").addEventListener("click", async () => {
  if (window.ethereum) {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    selectedAccount = accounts[0];
    document.getElementById("walletInfo").innerText = `Connected: ${selectedAccount}`;
    const web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(ABI, launchpadAddress);
  } else {
    alert("MetaMask not detected!");
  }
});

document.getElementById("contribute").addEventListener("click", async () => {
  const tokenSymbol = document.getElementById("token").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const feedback = document.getElementById("feedback");

  const tokens = {
    WBNB: "0x3E14602186DD9dE538F729547B3918D24c823546",
    WXRP: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
    WETH: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    WBTC: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
  };

  const tokenAddress = tokens[tokenSymbol];
  const web3 = new Web3(window.ethereum);
  const tokenContract = new web3.eth.Contract([
    { constant: false, inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], type: "function" },
    { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" }
  ], tokenAddress);

  const decimals = await tokenContract.methods.decimals().call();
  const amountInWei = web3.utils.toBN(amount * 10 ** decimals);

  try {
    feedback.innerText = "Approving token...";
    await tokenContract.methods.approve(launchpadAddress, amountInWei).send({ from: selectedAccount });

    feedback.innerText = "Sending contribution...";
    await contract.methods.contribute(tokenAddress, amountInWei).send({ from: selectedAccount });

    feedback.innerText = "✅ Contribution successful!";
  } catch (error) {
    console.error(error);
    feedback.innerText = "❌ Transaction failed.";
  }
});