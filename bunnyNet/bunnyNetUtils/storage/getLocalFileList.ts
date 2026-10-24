import { join, readdirSync, relative } from "../../deps.ts";
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

  for (const item of localFilePaths) {
    fileList[relative(path, item)] = await getFileHash(item);
  }

  console.log({ fileList });

  return fileList;
};
