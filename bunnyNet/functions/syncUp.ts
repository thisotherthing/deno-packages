import { join } from "../deps.ts";
import type { BunnyApiStorageZoneOptions } from "../types.ts";
import { deleteFile } from "../bunnyNetUtils/storage/deleteFile.ts";
import { getLocalFileList } from "../bunnyNetUtils/storage/getLocalFileList.ts";
import { getRemoteFileList } from "../bunnyNetUtils/storage/getRemoteFileList.ts";
import { uploadFile } from "../bunnyNetUtils/storage/uploadFile.ts";

/**
 * Sync local folder with Storage Zone
 * - it deletes files that are in the storage zone, but not in the local folder
 * - it uploads files that are in the local folder, but not in the storage zone
 * - it uploads files if the hash of the local file is different to the one in the storage zone
 *
 * @example
 * ```ts
 * await syncUp({
 *   localFolder: "./dist",
 *   apiKey: Deno.env.get("BUNNY_STORAGE_API_KEY") || "",
 *   hostname: Deno.env.get("BUNNY_STORAGE_REGION") || "",
 *   storageZoneName: Deno.env.get("BUNNY_STORAGE_ZONE_NAME") || "",
 * });
 * ```
 */
export const syncUp = async (
  options: {
    localFolder: string;
  } & BunnyApiStorageZoneOptions,
): Promise<{ neededToUpdateFiles: boolean }> => {
  const remoteFiles = await getRemoteFileList(options);

  const localFiles = await getLocalFileList(options.localFolder);

  const remoteSet = new Set(Object.keys(remoteFiles));
  const localSet = new Set(Object.keys(localFiles));

  // we want to delete remote files, that don't have matching local files
  const remoteFilesToDelete = remoteSet.difference(localSet);

  const filesToUpload: Set<string> = new Set();

  for (const [localPath, localHash] of Object.entries(localFiles)) {
    // upload files that are missing on remote
    if (!remoteFiles[localPath]) {
      filesToUpload.add(localPath);
      continue;
    }

    // only upload files, if the local has a different hash
    if (remoteFiles[localPath] !== localHash) {
      filesToUpload.add(localPath);
      continue;
    }
  }

  console.info(`files to delete: ${remoteFilesToDelete.size}`);
  for (const deletePath of remoteFilesToDelete) {
    console.log(`deleting "${deletePath}...`);
    await deleteFile({ ...options, path: deletePath });
  }

  console.info(`files to upload: ${filesToUpload.size}`);
  for (const uploadPath of filesToUpload) {
    console.log(`uploading "${uploadPath}...`);
    await uploadFile({
      ...options,
      localFilePath: join(options.localFolder, uploadPath),
      remotefilePath: uploadPath,
    });
  }

  return {
    neededToUpdateFiles: remoteFilesToDelete.size > 0 || filesToUpload.size > 0,
  };
};
