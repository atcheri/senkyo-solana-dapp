"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrezorWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { createContext, FC, PropsWithChildren, useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

type WalletConnectionContextProps = { network: WalletAdapterNetwork };

const WalletConnectionContext = createContext({});

export const WalletConnectionProvider: FC<
  PropsWithChildren<WalletConnectionContextProps>
> = ({ children, network }) => {
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TrezorWalletAdapter(),
    ],
    [network]
  );

  const value = {};

  return (
    <WalletConnectionContext.Provider value={value}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </WalletConnectionContext.Provider>
  );
};
