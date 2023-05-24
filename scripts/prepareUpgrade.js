async function main() {
  const proxyAddress = "0x27E52A81975F5Fb836e79007E3c478C6c0E6E9FB"; //proxy address here

  const Market = await ethers.getContractFactory("NFTMarketV2"); // new contract
  console.log("Preparing upgrade...");
  const marketV2Address = await upgrades.validateUpgrade(proxyAddress, Market, { kind: "uups" });
  console.log("FAED v2 at:", marketV2Address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
