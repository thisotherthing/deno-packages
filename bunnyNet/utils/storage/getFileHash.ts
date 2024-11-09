import { crypto } from "jsr:@std/crypto";
import { encodeHex } from "jsr:@std/encoding/hex";

export const getFileHash = async (path: string): Promise<string> => {
  const file = await Deno.open(path, { read: true });

  const readableStream = file.readable;

  const fileHashBuffer = await crypto.subtle.digest("SHA-256", readableStream);

  return encodeHex(fileHashBuffer).toUpperCase();
};
