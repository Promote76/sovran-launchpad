const connectWalletBtn = document.getElementById('connectWallet');
const walletAddressDiv = document.getElementById('walletAddress');
const contributeBtn = document.getElementById('contribute');
const tokenInput = document.getElementById('token');
const amountInput = document.getElementById('amount');
const statusDiv = document.getElementById('status');

const launchpadAddress = "0x0C0bfd4E4170411bc9665A368FaFaB3048883C4C";

const abi = [ /* shortened for brevity, insert full ABI manually */ ];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            walletAddressDiv.textContent = "Connected: " + address;
            contract = new ethers.Contract(launchpadAddress, abi, signer);
        } catch (err) {
            console.error("Connection error:", err);
        }
    } else {
        alert("MetaMask not detected.");
    }
}

async function contribute() {
    const token = tokenInput.value;
    const amount = ethers.utils.parseUnits(amountInput.value, 18);

    try {
        const tokenContract = new ethers.Contract(token, [
            "function approve(address spender, uint256 amount) public returns (bool)"
        ], signer);
        const approvalTx = await tokenContract.approve(launchpadAddress, amount);
        await approvalTx.wait();

        const tx = await contract.contribute(token, amount);
        await tx.wait();

        statusDiv.textContent = "Contribution successful!";
    } catch (err) {
        console.error("Contribution failed:", err);
        statusDiv.textContent = "Contribution failed.";
    }
}

connectWalletBtn.addEventListener('click', connectWallet);
contributeBtn.addEventListener('click', contribute);
