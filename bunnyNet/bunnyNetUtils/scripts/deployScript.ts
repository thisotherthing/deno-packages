/** */
/**
 * Deploy script to bunny.net
 * @link https://docs.bunny.net/reference/uploadedgescriptcodeendpoint_setcode
 *
 * @example
 * ```ts
 * await deployScript({
 *   sourceCode: Deno.readTextFileSync("src/script.ts"),
 *   scriptId: Deno.env.get("BUNNY_SCRIPT_ID") ?? "",
 *   deploymentKey: Deno.env.get("BUNNY_SCRIPT_DEPLOYMENT_KEY") ?? "",
 * });
 * ```
 */
export const deployScript = async (
  options:
    & {
      sourceCode: string;
      scriptId: string;
    }
    & { deploymentKey: string },
): Promise<void> => {
  const response = await fetch(
    `https://api.bunny.net/compute/script/${options.scriptId}/code`,
    {
      method: "POST",
      headers: {
        DeploymentKey: options.deploymentKey,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Code: options.sourceCode }),
    },
  );

  if (response.status !== 204) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
};
