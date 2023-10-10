import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { message } from 'antd';
import {WalletAdapterNetwork, WalletError} from '@solana/wallet-adapter-base';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import {
  TrustWalletAdapter
} from '@solana/wallet-adapter-wallets';
import {clusterApiUrl} from '@solana/web3.js';
import {AutoConnectProvider, useAutoConnect} from './AutoConnectProvider';
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';
import {NetworkConfigurationProvider, useNetworkConfiguration} from './NetworkConfigurationProvider';

const WalletContextProvider: FC<{ children: ReactNode }> = ({children}) => {
  const {autoConnect} = useAutoConnect();
  const {networkConfiguration} = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  console.log(network);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new TrustWalletAdapter(),
    ],
    [network]
  );

  const onError = useCallback(
    (error: WalletError) => {
      message.error(error.message ? `${error.name}: ${error.message}` : error.name);
      console.error(error);
    },
    []
  );

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({children}) => {
  return (
    <>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </>
  );
};
