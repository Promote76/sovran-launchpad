let web3;
let provider;

async function initWeb3() {
  if (window.ethereum) {
    provider = window.ethereum;
    web3 = new Web3(window.ethereum);
    try {
      await provider.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      alert("Wallet connection rejected.");
    }
  } else {
    alert("Please install MetaMask or use a DApp browser.");
  }
}
window.addEventListener('load', initWeb3);