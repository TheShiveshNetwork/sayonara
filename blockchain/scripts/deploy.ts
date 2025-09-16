import { ethers } from "hardhat";

async function main() {
  const WipeCertificate = await ethers.getContractFactory("WipeCertificate");
  const contract = await WipeCertificate.deploy();
  await contract.waitForDeployment();
  console.log("New contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
