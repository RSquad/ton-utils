import { TonClient } from "@tonclient/core";
import { TonContract } from "./ton-contract";

export const waitForTransaction = async (
  client: TonClient,
  filter: any,
  fields: string
) => {
  try {
    const { result } = await client.net.wait_for_collection({
      collection: "transactions",
      filter: filter,
      result: fields,
      timeout: 10000,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const waitForMessage = async (
  client: TonClient,
  filter: any,
  fields: string
) => {
  try {
    const { result } = await client.net.wait_for_collection({
      collection: "messages",
      filter: filter,
      result: fields,
      timeout: 10000,
    });
    return result;
  } catch (err) {
    throw err;
  }
};

export const callThroughMultisig = async ({
  client,
  smcSafeMultisigWallet,
  abi,
  functionName,
  input,
  dest,
  value,
}: {
  client: TonClient;
  smcSafeMultisigWallet: TonContract;
  abi: any;
  functionName: string;
  input: any;
  dest: string;
  value: number;
}) => {
  const { body } = await client.abi.encode_message_body({
    abi: { type: "Contract", value: abi },
    signer: { type: "None" },
    is_internal: true,
    call_set: {
      function_name: functionName,
      input,
    },
  });
  await smcSafeMultisigWallet.call({
    functionName: "sendTransaction",
    input: {
      dest,
      value,
      flags: 1,
      bounce: true,
      payload: body,
    },
  });
  await waitForMessage(
    client,
    {
      src: { eq: smcSafeMultisigWallet.address },
      dst: { eq: dest },
    },
    "now aborted"
  );
};

export const sendThroughMultisig = async ({
  smcSafeMultisigWallet,
  dest,
  value,
}: {
  smcSafeMultisigWallet: TonContract;
  dest: string;
  value: number;
}) =>
  await smcSafeMultisigWallet.call({
    functionName: "sendTransaction",
    input: {
      dest,
      value,
      bounce: false,
      flags: 1,
      payload: "",
    },
  });

export const deployRandomMultisig = async (
  client: TonClient,
  smcSafeMultisigWallet: TonContract
) => {
  const smcRandomMultisig = new TonContract({
    client,
    name: "randomMultisig",
    tonPackage: smcSafeMultisigWallet.tonPackage,
    keys: await client.crypto.generate_random_sign_keys(),
  });

  await smcRandomMultisig.calcAddress();

  await sendThroughMultisig({
    smcSafeMultisigWallet,
    dest: smcRandomMultisig.address,
    value: 1_000_000_000,
  });

  await smcRandomMultisig.deploy();

  return { smcRandomMultisig };
};
