import { useEffect, useState } from "react";

export const usePool = () => {
  const [loading, setLoading] = useState(false);
  const [lpTokenSupply, setLpTokenSupply] = useState();
  const [tokenReserves, setTokenReserves] = useState();
  const [nftReserves, setNftReserves] = useState();

  const price = tokenReserves / nftReserves;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLpTokenSupply(9028);
      setTokenReserves(21);
      setNftReserves(28);

      setLoading(false);
    }, 1000);
  }, []);

  return { price, lpTokenSupply, tokenReserves, nftReserves };
};
