import { Routing } from '#src/pages';
import { RainbowKitProvider, darkTheme, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { arbitrum, avalanche } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { withProviders } from './providers';

const Component = () => {
  const { chains, publicClient } = configureChains([arbitrum, avalanche], [publicProvider()]);

  const { connectors } = getDefaultWallets({
    appName: 'DexHub',
    projectId: '4b9157e81d6716368cd308c7fee42d04',
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#9D50FF',
          borderRadius: 'medium',
        })}
        chains={chains}
      >
        <Routing />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export const App = withProviders(Component);
