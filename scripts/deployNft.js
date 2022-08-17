async function main() {
  const NftContract = await ethers.getContractFactory("SingleNftMinter");

  console.log("Deploying proxy ...");
  const Nft = await upgrades.deployProxy(
    NftContract,
    ["Genadrop 1 of 1", "GND", "0x504D51f62846fbeee1c3d5ae518398b5d22bB905"],
    {
      kind: "uups",
      initializer: "initialize",
    }
  );
  console.log("proxy deployed to:", Nft.address);
  console.log("version no. : ", await Nft.name());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
