interface VercelDeployResult {
  success: boolean;
  url?: string;
  deploymentId?: string;
  error?: string;
}

interface VercelFile {
  file: string;
  data: string;
  encoding: "utf-8";
}

export async function deployToVercel(
  files: Record<string, string>,
  appSlug: string,
): Promise<VercelDeployResult> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return { success: false, error: "VERCEL_TOKEN not configured" };
  }

  const teamId = process.env.VERCEL_TEAM_ID;

  const vercelFiles: VercelFile[] = Object.entries(files).map(([path, content]) => ({
    file: path,
    data: content,
    encoding: "utf-8" as const,
  }));

  const deployPayload = {
    name: appSlug,
    files: vercelFiles,
    target: "production",
    projectSettings: {
      framework: "nextjs",
    },
  };

  const url = teamId
    ? `https://api.vercel.com/v13/deployments?teamId=${teamId}`
    : "https://api.vercel.com/v13/deployments";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deployPayload),
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      success: false,
      error: `Vercel deploy failed (${response.status}): ${body}`,
    };
  }

  const data = await response.json();

  // Use the production alias (appSlug.vercel.app) instead of the unique deployment URL,
  // since deployment URLs are only visible to the authenticated Vercel user
  return {
    success: true,
    url: `https://${appSlug}.vercel.app`,
    deploymentId: data.id,
  };
}
