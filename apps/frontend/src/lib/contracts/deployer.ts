import { ethers } from "ethers";
import { FUJI_CHAIN_CONFIG } from "@/lib/constants";
import { DeployResult } from "@/lib/types";

export async function deployContract(
  abi: unknown[],
  bytecode: string,
  constructorArgs: unknown[] = [],
): Promise<DeployResult> {
  try {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

    if (!privateKey) {
      return { success: false, error: "Deployer private key not configured" };
    }

    const provider = new ethers.JsonRpcProvider(FUJI_CHAIN_CONFIG.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const balance = await provider.getBalance(wallet.address);
    if (balance === BigInt(0)) {
      return { success: false, error: "Deployer wallet has no AVAX. Fund it from the Fuji faucet." };
    }

    const factory = new ethers.ContractFactory(abi as ethers.InterfaceAbi, bytecode, wallet);
    const contract = await factory.deploy(...constructorArgs);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    const deployTx = contract.deploymentTransaction();

    return {
      success: true,
      contractAddress: address,
      transactionHash: deployTx?.hash,
      explorerUrl: `${FUJI_CHAIN_CONFIG.explorerUrl}/address/${address}`,
      abi,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Deployment failed",
    };
  }
}
