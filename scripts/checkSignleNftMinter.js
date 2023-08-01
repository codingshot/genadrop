const contractAddress = "0xa7bB4C31Aaf38126515236FFf1a726301e241D8d";
const main = async () => {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   process.env.STAGING_QUICKNODE_KEY
  // );
  // const signer = hre.ethers.getSigner(process.env.PRIVATE_KEY, provider);
  let baseContract = await hre.ethers.getContractFactory("SingleNftMinter");
  let contract = baseContract.attach(contractAddress);

  console.log(contract.address);

  const txn = await contract.tokenURI(0);

  console.log(txn);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
