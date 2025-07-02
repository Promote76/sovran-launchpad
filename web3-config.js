
let web3;

async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    alert("Please install MetaMask or a compatible wallet.");
  }
}

export { web3, initWeb3 };
