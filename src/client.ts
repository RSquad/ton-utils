import { TonClient } from "@tonclient/core";
import { libNode } from "@tonclient/lib-node";
import { NETWORK_MAP } from "./constants";

export const createClient = (endpoints: string[] = null) => {
  TonClient.useBinaryLibrary(libNode);
  return new TonClient({
    network: {
      endpoints:
        endpoints || NETWORK_MAP[process.env.NETWORK] || NETWORK_MAP.DEVNET,
    },
  });
};
