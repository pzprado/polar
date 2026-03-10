import { NextRequest, NextResponse } from "next/server";
import { compileContract } from "@/lib/contracts/compiler";
import { deployContract } from "@/lib/contracts/deployer";
import { DeployRequest } from "@/lib/types";

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
    return NextResponse.json(deployResult);
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Deployment failed" },
      { status: 500 },
    );
  }
}
