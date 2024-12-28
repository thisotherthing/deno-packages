import { purgeCache } from "../bunnyNetUtils/cdn/purgeCache.ts";
import { syncUp } from "./syncUp.ts";

/**
 * Sync local folder with Storage Zone and purge Pull Zone, if files changes
 *
 * @example
 * ```ts
 * await syncUpAndPurgeCache({
 *   localFolder: "./dist",
 *   apiKey: Deno.env.get("BUNNY_STORAGE_API_KEY") || "",
 *   hostname: Deno.env.get("BUNNY_STORAGE_REGION") || "",
 *   storageZoneName: Deno.env.get("BUNNY_STORAGE_ZONE_NAME") || "",
 *   pullZoneId: Deno.env.get("BUNNY_PULL_ZONE_ID") || "",
 * });
 * ```
 */
export const syncUpAndPurgeCache = async (
  options: Parameters<typeof syncUp>[0] & Parameters<typeof purgeCache>[0],
): Promise<void> => {
  const syncResult = await syncUp(options);

  if (syncResult.neededToUpdateFiles) {
    await purgeCache(options);
  }
};
