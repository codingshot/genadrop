async function main() {
  const proxyAddress = "0x57Eb0aaAf69E22D8adAe897535bF57c7958e3b1b";
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
