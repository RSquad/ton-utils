import { TonClient } from "@tonclient/core";
import { libNode } from "@tonclient/lib-node";

export const NETWORK_MAP = {
  LOCAL: ["http://0.0.0.0/", "http://127.0.0.1/", "http://localhost/"],
  DEVNET: ["https://net1.ton.dev/", "https://net5.ton.dev/"],
  MAINNET: [
    "https://main2.ton.dev/",
    "https://main3.ton.dev/",
    "https://main4.ton.dev/",
  ],
};

export const createClient = (endpoints: string[] = null) => {
  TonClient.useBinaryLibrary(libNode);
  return new TonClient({
    network: {
      endpoints:
        endpoints || NETWORK_MAP[process.env.NETWORK] || NETWORK_MAP.DEVNET,
    },
  });
};
