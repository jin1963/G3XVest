const contractAddress = "0x2553674aE4ff730056DaA445Bf4e7d26cA31335A";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

let web3;
let contract;
let user;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    user = accounts[0];
    contract = new web3.eth.Contract(contractABI, contractAddress);
    document.getElementById("walletStatus").innerText = "✅ Connected: " + user;
  } else {
    alert("MetaMask not found");
  }
}

async function stake() {
  const amount = document.getElementById("amount").value;
  const tier = document.getElementById("tierSelect").value;

  if (!amount || isNaN(amount) || amount <= 0) {
    alert("Enter valid amount.");
    return;
  }

  const stakeAmount = web3.utils.toWei(amount, "ether");
  const token = new web3.eth.Contract(
    [
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
    ],
    tokenAddress
  );

  await token.methods.approve(contractAddress, stakeAmount).send({ from: user });
  await contract.methods.stake(stakeAmount, tier).send({ from: user });
}

async function claim() {
  try {
    await contract.methods.claimRewards().send({ from: user });
    alert("🎉 Claimed!");
  } catch (err) {
    console.error(err);
    alert("❌ Claim failed");
  }
}

async function unstake() {
  try {
    await contract.methods.unstake().send({ from: user });
    alert("✅ Unstaked!");
  } catch (err) {
    console.error(err);
    alert("❌ Unstake failed");
  }
}
