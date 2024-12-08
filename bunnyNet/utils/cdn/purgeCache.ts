/**
 * Purge Pull Zone cache
 * calls https://api.bunny.net/pullzone/{id}/purgeCache
 *
 * @example
 * ```ts
 * await purgeCache({
 *   apiKey: Deno.env.get("BUNNY_API_KEY") || "",
 *   pullZoneId: Deno.env.get("BUNNY_PULL_ZONE_ID") || "",
 * });
 * ```
 */
export const purgeCache = async (
  options: { pullZoneId: string; apiKey: string },
): Promise<void> => {
  const url = `https://api.bunny.net/pullzone/${options.pullZoneId}/purgeCache`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      AccessKey: options.apiKey,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 204) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  console.info(`purged pull zone "${options.pullZoneId}"`);
};
