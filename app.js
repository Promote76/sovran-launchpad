const contractAddress = "0x0C0bfd4E4170411bc9665A368FaFaB3048883C4C";
const abi = [/* ABI goes here */];

let contract;
let userAddress;

document.getElementById("connectWalletBtn").onclick = async () => {
  await initWeb3();
  const accounts = await web3.eth.getAccounts();
  userAddress = accounts[0];
  contract = new web3.eth.Contract(abi, contractAddress);
  document.getElementById("connectWalletBtn").innerText = "Connected";
};

document.getElementById("contributeBtn").onclick = async () => {
  const tokenSymbol = document.getElementById("tokenSelect").value;
  const tokenMap = {
    WBNB: "0x3E14602186DD9dE538F729547B3918D24c823546",
    WXRP: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
    WETH: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    WBTC: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c"
  };
  const token = tokenMap[tokenSymbol];
  const amount = web3.utils.toWei(document.getElementById("amount").value, 'ether');
  try {
    const tokenContract = new web3.eth.Contract([
      { "constant": false, "inputs": [
        { "name": "spender", "type": "address" },
        { "name": "amount", "type": "uint256" }
      ], "name": "approve", "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
      }
    ], token);

    await tokenContract.methods.approve(contractAddress, amount).send({ from: userAddress });

    await contract.methods.contribute(token, amount).send({ from: userAddress });

    document.getElementById("feedback").innerText = "Contribution successful!";
  } catch (err) {
    document.getElementById("feedback").innerText = "Transaction failed: " + err.message;
  }
};