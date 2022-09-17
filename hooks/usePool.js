import { BigNumber, Contract } from "ethers";
import { useEffect, useState } from "react";
import {
  ContractMethodNoResultError,
  erc20ABI,
  useBlockNumber,
  useProvider,
  useSigner,
} from "wagmi";
import sudoPairAbi from "../contracts/sudoPair.abi.json";
import { useNfts } from "./useNfts";

export const usePool = () => {
  const [loading, setLoading] = useState(false);
  const [lpTokenSupply, setLpTokenSupply] = useState();
  const [tokenReserves, setTokenReserves] = useState();
  const { data: blockNumber } = useBlockNumber();
  const [nftReserves, setNftReserves] = useState();
  const [wheyfus, loadingNfts] = useNfts({
    limit: Infinity,
    offset: 0,
    address: process.env.NEXT_PUBLIC_SUDO_POOL_ADDRESS,
    tokenAddress: process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
  });

  const { data: signer } = useSigner();
  const provider = useProvider();

  const fetchData = async () => {
    const pair = new Contract(
      process.env.NEXT_PUBLIC_SUDO_POOL_ADDRESS,
      sudoPairAbi,
      signer || provider
    );

    const lpToken = new Contract(
      process.env.NEXT_PUBLIC_LP_TOKEN_ADDRESS,
      erc20ABI,
      signer || provider
    );

    const tokenReserves = await pair.spotPrice();
    const nftReserves = await pair.delta();
    const lpTokenSupply = await lpToken.totalSupply();

    setTokenReserves(tokenReserves);
    setNftReserves(nftReserves);
    setLpTokenSupply(lpTokenSupply);
  };

  useEffect(() => {
    setLoading(true);

    fetchData().then(() => setLoading(false));
  }, [blockNumber]);

  const price = tokenReserves?.gt(0)
    ? tokenReserves.div(nftReserves)
    : BigNumber.from(0);

  return {
    price,
    lpTokenSupply,
    tokenReserves,
    nftReserves,
    wheyfus,
    loadingNfts,
  };
};
