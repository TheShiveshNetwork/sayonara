import { ContractModule } from "ignition-framework";

export const WipeCertificateModule: ContractModule = {
  // This name MUST match the Solidity contract name
  name: "WipeCertificate",

  // Deploy function
  deploy: async ({ ethers }) => {
    // Initial certificate hash (can be anything)
    const initialHash = "initial_placeholder_hash";

    // Get the contract factory for WipeCertificate
    const WipeCertificate = await ethers.getContractFactory("WipeCertificate");

    // Deploy contract with the initial hash
    const contract = await WipeCertificate.deploy(initialHash);

    // Wait until deployed
    await contract.deployed();

    console.log(`WipeCertificate deployed at: ${contract.address}`);

    return contract;
  },
};
