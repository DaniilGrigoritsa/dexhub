import { Routing } from '#src/pages';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { arbitrum, avalanche } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { withProviders } from './providers';

import { Trader } from '#src/types';
import { useState } from 'react';

const Component = () => {
  const { chains, publicClient } = configureChains([arbitrum, avalanche], [publicProvider()]);
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
  });

  const [trader, setTrader] = useState<Trader | null>(null);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#9D50FF',
          borderRadius: 'medium',
        })}
        chains={chains}
      >
        <Routing trader={trader} setTrader={setTrader}/>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export const App = withProviders(Component);
