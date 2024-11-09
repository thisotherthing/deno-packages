export type BunnyApiOptions = {
  apiKey: string;
};

export type BunnyApiStoratgeZoneOptions = BunnyApiOptions & {
  /**
   * for instance "storage.bunnycdn.com" for region Falkenstein, DE
   * https://docs.bunny.net/reference/put_-storagezonename-path-filename#api-base-endpoint
   */
  hostname: string;
  storageZoneName: string;
};

/** map file name to checksum */
export type FileList = Record<string, string>;
