import { createReadStream, crypto, encodeHex } from "../../deps.ts";

export const getFileHash = async (path: string): Promise<string> => {
  const file = createReadStream(path);

  const fileHashBuffer = await crypto.subtle.digest("SHA-256", file);

  return encodeHex(fileHashBuffer).toUpperCase();
};
