import { walkSync } from "@std/fs";
import type { FileList } from "../../types.ts";
import { getFileHash } from "./getFileHash.ts";

export const getLocalFileList = async (
  path: string,
): Promise<FileList> => {
  const fileList: FileList = {};

  const localFilePaths = [
    ...walkSync(path, {
      includeDirs: false,
      includeSymlinks: false,
      skip: [/\.DS_Store/],
    }),
  ]
    .map((e) => e.path);

  // we don't want to include the root path
  // so we count how many chars to remove from the start of the paths
  const startPathCharsToRemove = path.length - 1;

  for (const item of localFilePaths) {
    fileList[item.substring(startPathCharsToRemove)] = await getFileHash(item);
  }

  return fileList;
};
