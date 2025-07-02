window.addEventListener("load", async () => {
  if (typeof window.ethereum !== "undefined") {
    window.web3 = new Web3(window.ethereum);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (e) {
      console.error("User denied wallet connection");
    }
  } else {
    alert("Please install MetaMask or use a Web3-enabled browser.");
  }
});