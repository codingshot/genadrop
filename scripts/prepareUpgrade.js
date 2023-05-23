async function main() {
  const proxyAddress = "0xB9eEFb0C664c86d7e375D5136167Fe80D5C4B94D"; //proxy address here

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
