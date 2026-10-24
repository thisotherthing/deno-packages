import { join, readdirSync } from "../../deps.ts";
import type { FileList } from "../../types.ts";
import { getFileHash } from "./getFileHash.ts";

export const getLocalFileList = async (
  path: string,
): Promise<FileList> => {
  const fileList: FileList = {};

  const localFilePaths: string[] = [
    ...readdirSync(path, {
      recursive: true,
      encoding: "utf8",
      withFileTypes: true,
    })
      .filter((e) => e.isFile())
      .map((e) => join(e.parentPath, e.name))
      .filter((e) =>
        ![".DS_Store"].some((filterWord) => e.endsWith(filterWord))
      ),
  ];

  // we don't want to include the root path
  // so we count how many chars to remove from the start of the paths
  const startPathCharsToRemove = path.length - 1;

  for (const item of localFilePaths) {
    fileList[item.substring(startPathCharsToRemove)] = await getFileHash(item);
  }

  console.log({ fileList });

  return fileList;
};
