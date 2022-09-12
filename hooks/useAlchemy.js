import { Network, Alchemy } from "alchemy-sdk";
import { useMemo } from "react";
import { chain } from "wagmi";

const chainIdToNetworks = {
  [chain.rinkeby.id]: Network.ETH_RINKEBY,
  [chain.mainnet.id]: Network.ETH_MAINNET,
};

export const useAlchemy = () => {
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    network: chainIdToNetworks[process.env.NEXT_PUBLIC_CHAIN_ID],
    maxRetries: 10,
  };

  const web3 = useMemo(() => {
    return new Alchemy(settings);
  }, []);

  return web3;
};
