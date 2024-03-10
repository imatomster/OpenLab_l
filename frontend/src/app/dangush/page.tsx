"use client";

import { useState, useEffect } from 'react';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';


const APP_NAME = 'ZeroRepV0';

// Define the types for your accounts and extensions if they're not already defined
type InjectedAccountWithMeta = Awaited<ReturnType<typeof web3Accounts>>[number];
type InjectedExtension = Awaited<ReturnType<typeof web3Enable>>[number];

export default function Home() {
  const [extensions, setExtensions] = useState<InjectedExtension[]>([]);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]); // Explicitly type the state here
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    const ALEPH_ZERO_TESTNET_WS_PROVIDER = new WsProvider('wss://ws.test.azero.dev');
    const initializeApi = async () => {
      const api = await ApiPromise.create({ provider: ALEPH_ZERO_TESTNET_WS_PROVIDER });
      setApi(api);
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
      <button onClick={makeTransfer}>Make transfer</button>
    </div>
  );
}
