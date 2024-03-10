"use client";

import { useState, useEffect } from 'react';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN, BN_ONE } from '@polkadot/util';
import appMetadata from '@/public/contract-abi.json';
import { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { Weight, ContractExecResult } from "@polkadot/types/interfaces";
import { AbiMessage, ContractOptions } from "@polkadot/api-contract/types";
import { blake2AsHex } from '@polkadot/util-crypto';

const APP_NAME = 'ZeroRepV0';
const APP_PROVIDER_URL = "wss://ws.test.azero.dev";

const wsProvider = new WsProvider(APP_PROVIDER_URL);
const APP_ADDRESS = "5GvXJ8rcUF7jreeN14NuMndao8ieUiet9HYksButJzHMKsQQ";

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);


// Define the types for your accounts and extensions if they're not already defined
type InjectedAccountWithMeta = Awaited<ReturnType<typeof web3Accounts>>[number];
type InjectedExtension = Awaited<ReturnType<typeof web3Enable>>[number];
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export default function Home() {

  const [extensions, setExtensions] = useState<InjectedExtension[]>([]);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]); // Explicitly type the state here
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [contract, setContract] = useState<ContractPromise | null>(null);

  useEffect(() => {
    const initializeApi = async () => {
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);

      // Once the API is available, initialize the contract
      const appContract = new ContractPromise(
        api, // This assumes api is now initialized and available
        appMetadata,
        APP_ADDRESS
      );
      setContract(appContract); // Store the contract instance in the state
    };

    initializeApi();
  }, []);

  const loadAccountsFromExtensions = async () => {
    const injectedExtensions = await web3Enable(APP_NAME);
    console.log(injectedExtensions);

    setExtensions(injectedExtensions);

    const accounts = await web3Accounts(
      { extensions: ["aleph-zero-signer"] }
    );

    console.log(accounts);
    setAccounts(accounts); // This should now work without type errors
  };

  const makeTransfer = async () => {
    if (!api) {
      console.error("API is not initialized.");
      return; // Or handle this case more gracefully
    }

    const first = accounts[0];

    const firstAddressInjector = await web3FromAddress(first.address);
    const transferAmount = new BN(1);
    const unitAdjustment = new BN(10).pow(new BN(api.registry.chainDecimals[0]));
    const finalAmount = transferAmount.mul(unitAdjustment);

    await api.tx.balances
      .transferAllowDeath("5CQ3tamph5Fpht2TNpr76Dn9SN2LBnizFSLwRzj48oMhVSD3", finalAmount)
      .signAndSend(first.address, { signer: firstAddressInjector.signer });
  };

  const queryContract = async (method: string, args: unknown[]) => {
    if (!api || !contract) {
      console.error("API or contract is not initialized.");
      return;
    }

    const readOnlyGasLimit = api.registry.createType('WeightV2', {
      refTime: new BN(1_000_000_000_000),
      proofSize: MAX_CALL_WEIGHT,
    }) as WeightV2;


    // Assuming `getByAccount` is a method in your contract that requires an `accountId`
    // Replace `getByAccount` with the actual method you wish to call and adjust parameters accordingly
    const {
      gasConsumed,
      gasRequired,
      storageDeposit,
      result,
      output,
      debugMessage,
    } = await contract.query[method](
      contract.address, // This assumes your contract instance is correctly set up and contains an address
      {
        gasLimit: readOnlyGasLimit, // Use the readOnlyGasLimit as defined above
      },
      ...args
    );

    if (result.isOk && output) {
      console.log("Query successful:", output.toHuman());
    } else if (result.isErr) {
      console.error("Query failed:", result.toHuman());
    }
  };
  
  const toContractAbiMessage = (
    contractPromise: ContractPromise,
    message: string
  ): Result<AbiMessage, string> => {
    const value = contractPromise.abi.messages.find((m) => m.method === message);
  
    if (!value) {
      const messages = contractPromise?.abi.messages
        .map((m) => m.method)
        .join(", ");
  
      const error = `"${message}" not found in metadata.spec.messages: [${messages}]`;
      console.error(error);
  
      return { ok: false, error };
    }
  
    return { ok: true, value };
  };

  // Function to estimate gas limit
  const getGasLimit = async (
    api: ApiPromise,
    userAddress: string,
    message: string,
    contract: ContractPromise,
    options = {} as ContractOptions,
    args = [] as unknown[]
  ): Promise<Result<Weight, string>> => {
    const abiMessage = toContractAbiMessage(contract, message);
    if (!abiMessage.ok) return abiMessage;

    const { value, gasLimit, storageDepositLimit } = options;

    const { gasConsumed, gasRequired, storageDeposit, debugMessage, result } =
      await api.call.contractsApi.call<ContractExecResult>(
        userAddress,
        contract.address,
        value ?? new BN(0),
        gasLimit ?? null,
        storageDepositLimit ?? null,
        abiMessage.value.toU8a(args)
      );

    return { ok: true, value: gasRequired };
  };
  
  // Function to perform a transaction
  const sendTransaction = async (
    api: ApiPromise,
    contract: ContractPromise,
    userAccount: InjectedAccountWithMeta,
    method: string,
    args: unknown[],
    options: ContractOptions = {}
  ): Promise<void> => {
    if (!userAccount.meta.source) return;

    const gasLimitResult = await getGasLimit(
      api,
      userAccount.address,
      method,
      contract,
      options,
      args
    );

    if (!gasLimitResult.ok) {
      console.log(gasLimitResult.error);
      return;
    }

    const { value: gasLimit } = gasLimitResult;

    const tx = contract.tx[method](
      {
        value: options.value ?? new BN(0), // amount of native token to be transferred
        gasLimit,
      },
      ...args
    );

    // TODO: potential cause for concern
    const injector = await web3FromAddress(userAccount.address);

    await tx
      .signAndSend(
        userAccount.address,
        { signer: injector.signer },
        ({ events = [], status }) => {
          events.forEach(({ event }) => {
            const { method } = event;
            if (method === "ExtrinsicSuccess" && status.isInBlock) {
              console.log(`Success: ${status}.`);
            } else if (method === "ExtrinsicFailed") {
              console.log(`An error occurred: ${method}.`);
            }
          });
        }
      )
      .catch((error) => {
        console.log(`An error occurred: ${error}.`);
      });
  };

  const handleAddPost = async () => {
    if (!api || !contract) {
      console.error("API or contract is not initialized.");
      return;
    }
    // Assuming api, contract, and userAccount are correctly set up
    try {
      const filecoin_hash = blake2AsHex("ipfs");
      //TODO: do signing thing here
      const nullifier = blake2AsHex("nullifier");


      const result = await sendTransaction(api, contract, accounts[0], "addPost", [filecoin_hash, nullifier, "red"]);
      console.log("Transaction result:", result);
      // Process result here
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };  
  
  return (
    <div>
      <button onClick={loadAccountsFromExtensions}>Connect to extensions</button>
      <h2>Signer accounts</h2>
      <ul>
        {accounts.map(({ address, meta: { name } }) => (
          <li key={address}>
            <strong>{name || "<unknown>"}</strong> {address}
          </li>
        ))}
      </ul>
      {/* <button onClick={() => queryContract("getNullifiers")}>Make transfer</button> */}
      <div>
        {/* Existing UI elements */}
        <button onClick={handleAddPost}>Add Post</button>
      </div>  
      <div>
        {/* Existing UI elements */}
        <button onClick={() => queryContract("getNullifiers", [blake2AsHex("ipfs")])}>View Posts</button>
      </div>  
    </div>
  );
}
