import { TonContract } from "./ton-contract";

export const logPubGetter = async (
  str: string,
  smc: TonContract,
  functionName: string
) =>
  console.log(
    `${str}: ${JSON.stringify(
      (await smc.run({ functionName: functionName })).value[functionName],
      null,
      4
    )}`
  );

export const logGetter = async (
  str: string,
  smc: TonContract,
  functionName: string
) =>
  console.log(
    `${str}: ${JSON.stringify(
      (await smc.run({ functionName: functionName })).value,
      null,
      4
    )}`
  );

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const genRandomHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

export const isAddrActive = async (client: TonClient, addr: string) => {
  const { result } = await client.net.query_collection({
    collection: "accounts",
    filter: { id: { eq: addr } },
    result: "acc_type",
  });
  if (result[0] && result[0].acc_type == 1) return true;
  return false;
};
