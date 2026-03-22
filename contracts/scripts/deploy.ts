import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying OneDealMarketplace on ${network.name}...`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Fee recipient: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} native`);

  const Marketplace = await ethers.getContractFactory("OneDealMarketplace");
  const marketplace = await Marketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();

  const address = await marketplace.getAddress();
  console.log(`OneDealMarketplace deployed to: ${address}`);
  console.log(`Platform fee: 2.5%`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
