import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
    baseSepolia
} from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http('https://base-sepolia.drpc.org')
    },
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
});

// Create a public client using the config
export const publicClient = wagmiConfig.getClient({
  chainId: baseSepolia.id
}); 