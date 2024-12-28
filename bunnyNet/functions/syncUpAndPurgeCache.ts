import { purgeCache } from "../bunnyNetUtils/cdn/purgeCache.ts";
import { syncUp } from "./syncUp.ts";

/**
 * Sync local folder with Storage Zone and purge Pull Zone, if files changes
 *
 * @example
 * ```ts
 * await syncUpAndPurgeCache({
 *   localFolder: "./dist",
 *   storageZoneApiKey: Deno.env.get("BUNNY_STORAGE_API_KEY") || "",
 *   hostname: Deno.env.get("BUNNY_STORAGE_REGION") || "",
 *   storageZoneName: Deno.env.get("BUNNY_STORAGE_ZONE_NAME") || "",
 *   apiKey: Deno.env.get("BUNNY_API_KEY") || "",
 *   pullZoneId: Deno.env.get("BUNNY_PULL_ZONE_ID") || "",
 * });
 * ```
 */
export const syncUpAndPurgeCache = async (
  options:
    & Omit<Parameters<typeof syncUp>[0], "apiKey">
    & Parameters<typeof purgeCache>[0]
    & { storageZoneApiKey: string },
): Promise<void> => {
  const syncResult = await syncUp({
    ...options,
    apiKey: options.storageZoneApiKey,
  });

  if (syncResult.neededToUpdateFiles) {
    await purgeCache(options);
  } else {
    console.info("no files were updated, so skipping cache purge");
  }
};
