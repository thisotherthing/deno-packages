import { createReadStream } from "../../deps.ts";
import type { BunnyApiStorageZoneOptions } from "../../types.ts";

/**
 * https://docs.bunny.net/reference/delete_-storagezonename-path-filename
 */
export const uploadFile = async (
  options: BunnyApiStorageZoneOptions & {
    localFilePath: string;
    remotefilePath: string;
  },
): Promise<void> => {
  const urlBuilder: string[] = [];

  urlBuilder.push(options.hostname);
  urlBuilder.push(options.storageZoneName);
  urlBuilder.push(options.remotefilePath);

  const url = `https://${urlBuilder.filter(Boolean).join("/")}`;

  const file = createReadStream(options.localFilePath);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: options.apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: file,
    // duplex: "half",
  });

  if (response.status !== 201) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
};
