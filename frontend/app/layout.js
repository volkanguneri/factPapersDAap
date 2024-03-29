"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import "./globals.css";

require("dotenv").config();

const { chains, publicClient } = configureChains(
  [hardhat, sepolia],
  [publicProvider()]
);

const { WALLETCONNECT_ID } = process.env;

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: WALLETCONNECT_ID || "48850a402642441a360aaf998ac21039",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
