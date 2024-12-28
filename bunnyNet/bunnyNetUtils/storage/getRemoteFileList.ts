import type { BunnyApiStorageZoneOptions, FileList } from "../../types.ts";

export type BunnyStorageObject = {
  Path: string;
  ObjectName: string;
  IsDirectory: boolean;
  Checksum: string | null;
};

/**
 * https://docs.bunny.net/reference/get_-storagezonename-path-
 */
const getFilesList = async (
  options: BunnyApiStorageZoneOptions & { path?: string },
): Promise<BunnyStorageObject[]> => {
  const urlBuilder: string[] = [];

  urlBuilder.push(options.hostname);
  urlBuilder.push(options.storageZoneName);
  urlBuilder.push(options.path || "");

  const url = `https://${urlBuilder.filter(Boolean).join("/")}/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      AccessKey: options.apiKey,
      accept: "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  return json;
};

export const setRecursiveFileList = async (
  target: FileList,
  options: BunnyApiStorageZoneOptions & { path?: string },
) => {
  const folderData = await getFilesList(options);

  for (const item of folderData) {
    if (item.IsDirectory) {
      await setRecursiveFileList(target, {
        ...options,
        path: [options.path, item.ObjectName].filter(Boolean).join("/"),
      });
    } else {
      target[[options.path, item.ObjectName].filter(Boolean).join("/")] =
        item.Checksum || "";
    }
  }
};

export const getRemoteFileList = async (
  options: BunnyApiStorageZoneOptions & { path?: string },
): Promise<FileList> => {
  const fileList: FileList = {};

  await setRecursiveFileList(fileList, options);

  return fileList;
};
