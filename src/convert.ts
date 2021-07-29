const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);

export const utf8ToHex = convert("utf8", "hex");
export const hexToUtf8 = convert("hex", "utf8");
export const base64ToHex = convert("base64", "hex");
export const hexToBase64 = convert("hex", "base64");
export const base64ToUtf8 = convert("base64", "utf8");
