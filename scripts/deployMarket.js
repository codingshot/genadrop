async function main() {
  const NFTMarket = await ethers.getContractFactory("NFTMarket");

  console.log("Deploying proxy ...");

  // console.log("version no. : ", await Nft.sayversion(), await Nft.symbol());

  const Market = await upgrades.deployProxy(NFTMarket, ["GenaDrop"], { kind: "uups", initializer: "initialize" });

  console.log("proxy deployed to:", Market.address);
  console.log(await Market._itemsSold());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
