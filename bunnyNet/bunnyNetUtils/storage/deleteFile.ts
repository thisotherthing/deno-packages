import type { BunnyApiStorageZoneOptions } from "../../types.ts";

/**
 * https://docs.bunny.net/reference/delete_-storagezonename-path-filename
 */
export const deleteFile = async (
  options: BunnyApiStorageZoneOptions & { path: string },
): Promise<void> => {
  const urlBuilder: string[] = [];

  urlBuilder.push(options.hostname);
  urlBuilder.push(options.storageZoneName);
  urlBuilder.push(options.path);

  const url = `https://${urlBuilder.filter(Boolean).join("/")}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      AccessKey: options.apiKey,
    },
  });

  if (response.status !== 200) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
};
