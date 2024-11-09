import { join } from "jsr:@std/path/join";
import type { BunnyApiStoratgeZoneOptions } from "./types.ts";
import { deleteFile } from "./utils/storage/deleteFile.ts";
import { getLocalFileList } from "./utils/storage/getLocalFileList.ts";
import { getRemoteFileList } from "./utils/storage/getRemoteFileList.ts";
import { uploadFile } from "./utils/storage/uploadFile.ts";

export const syncUp = async (
  options: {
    localFolder: string;
  } & BunnyApiStoratgeZoneOptions,
) => {
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
    console.log(`deletting "${deletePath}...`);
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
};
