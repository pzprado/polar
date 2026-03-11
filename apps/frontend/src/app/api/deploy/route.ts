import { NextRequest, NextResponse } from "next/server";
import { compileContract } from "@/lib/contracts/compiler";
import { deployContract } from "@/lib/contracts/deployer";
import { assembleNextProject } from "@/lib/deploy/project-assembler";
import { deployToVercel } from "@/lib/deploy/vercel-deployer";
import { DeployRequest, DeployResult } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: DeployRequest = await request.json();

    if (!body.contractSource || !body.contractName) {
      return NextResponse.json(
        { success: false, error: "Contract source and name are required" },
        { status: 400 },
      );
    }

    // Step 1: Compile and deploy contract to Avalanche
    const compileResult = compileContract(body.contractSource, body.contractName);

    if (!compileResult.success || !compileResult.abi || !compileResult.bytecode) {
      return NextResponse.json(
        {
          success: false,
          error: `Compilation failed: ${compileResult.errors?.join(", ") || "Unknown error"}`,
        },
        { status: 400 },
      );
    }

    const deployResult = await deployContract(compileResult.abi, compileResult.bytecode, []);

    if (!deployResult.success) {
      return NextResponse.json(deployResult);
    }

    const result: DeployResult = { ...deployResult };

    // Step 2: If frontend files provided, deploy to Vercel
    if (body.frontendFiles && body.frontendFiles.length > 0 && process.env.VERCEL_TOKEN) {
      const contractAddress = deployResult.contractAddress || "";
      const appSlug = body.appSlug || body.contractName.toLowerCase().replace(/[^a-z0-9]/g, "-");

      const projectFiles = assembleNextProject(body.frontendFiles, contractAddress, body.contractName);
      const vercelResult = await deployToVercel(projectFiles, appSlug);

      if (vercelResult.success) {
        result.frontendUrl = vercelResult.url;
        result.vercelDeploymentId = vercelResult.deploymentId;
      } else {
        result.frontendError = vercelResult.error;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Deployment failed" },
      { status: 500 },
    );
  }
}
