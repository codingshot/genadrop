async function main() {
  const proxyAddress = "0x27E52A81975F5Fb836e79007E3c478C6c0E6E9FB";
  const Market = await ethers.getContractFactory("NFTMarketV2");
  console.log("Preparing upgrade...");
  const MarketV2Address = await upgrades.upgradeProxy(proxyAddress, Market, { kind: "uups" });
  console.log(MarketV2Address.address)
  console.log("finishing upgrade...");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
