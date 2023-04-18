async function main() {
  const proxyAddress = "0xee7Ff1636FF6e85c1613FDDD703E4A48b2b2A9A0"; //proxy address here

  const Market = await ethers.getContractFactory("NFTMarketV2"); // new contract
  console.log("Preparing upgrade...");
  const MarketV2Address = await upgrades.validateUpgrade(proxyAddress, Market, { kind: "uups" });
  console.log("FAED v2 at:", MarketV2Address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
