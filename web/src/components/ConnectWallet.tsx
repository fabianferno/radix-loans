import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    keplr: any; // Use 'any' or a more specific type if you have the type information
    getOfflineSigner: any; // Use 'any' or a more specific type if you have the type information
  }
}

interface Props {
  setSigner: any;
}

const ConnectWallet = ({ setSigner }: Props) => {
  const [account, setAccount] = useState(null);

  const suggestChain = async () => {
    await window.keplr.experimentalSuggestChain({
      chainId: "archway-1",
      chainName: "Archway",
      rpc: "https://rpc.mainnet.archway.io",
      rest: "https://rest.mainnet.archway.io",
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: "archway",
        bech32PrefixAccPub: "archwaypub",
        bech32PrefixValAddr: "archwayvaloper",
        bech32PrefixValPub: "archwayvaloperpub",
        bech32PrefixConsAddr: "archwayvalcons",
        bech32PrefixConsPub: "archwayvalconspub",
      },
      currencies: [
        {
          coinDenom: "ARCH",
          coinMinimalDenom: "uarch",
          coinDecimals: 6,
          coinGeckoId: "archway",
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "ARCH",
          coinMinimalDenom: "uarch",
          coinDecimals: 6,
          coinGeckoId: "archway",
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: "ARCH",
        coinMinimalDenom: "uarch",
        coinDecimals: 6,
        coinGeckoId: "archway",
      },
      features: ["ibc-transfer"],
    });
  };

  const connectWallet = useCallback(async () => {
    if (window.keplr) {
      try {
        await suggestChain();
        await window.keplr.enable("archway-1");
        const offlineSigner = window.getOfflineSigner("archway-1");
        const accounts = await offlineSigner.getAccounts();
        setAccount(accounts[0].address);
        setSigner(offlineSigner);
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      alert("Please install Keplr extension");
    }
  }, [setSigner]);

  useEffect(() => {
    if (window.keplr) {
      window.addEventListener("keplr_keystorechange", connectWallet);
      return () => {
        window.removeEventListener("keplr_keystorechange", connectWallet);
      };
    }
  }, [connectWallet]);

  return (
    <section className="text-center mt-4 ring-1 ring-zinc-400">
      {account ? (
        <div className="text-sm">Connected: {account}</div>
      ) : (
        <Button color="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </section>
  );
};

export default ConnectWallet;
