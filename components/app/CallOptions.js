import { BigNumber, constants } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNfts } from "../../hooks/useNfts";

const useCallOptions = () => {
  const { address } = useAccount();
  const [callOptions, setCallOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [puttyOptions] = useNfts({
    offset: 0,
    limit: Infinity,
    tokenAddress: process.env.NEXT_PUBLIC_PUTTY_ADDRESS,
    address,
  });

  const filterCallOptions = async () => {
    setLoading(true);

    const orders = await Promise.all(
      puttyOptions.map(async ({ tokenId }) => {
        const orderHash = BigNumber.from(tokenId).toHexString();
        const url = `${process.env.NEXT_PUBLIC_PUTTY_API}/orders/${orderHash}`;
        return fetch(url).then((r) => r.json());
      })
    );

    const callOptions = orders.filter(
      ({ orderDetails }) =>
        orderDetails.maker.toLowerCase() ===
        process.env.NEXT_PUBLIC_WHEYFU_ADDRESS.toLowerCase()
    );

    setCallOptions(callOptions);
    setLoading(false);
  };

  useEffect(() => {
    filterCallOptions();
  }, [puttyOptions]);

  return [callOptions, loading];
};

export const CallOptions = () => {
  const [callOptions, loading] = useCallOptions();

  return (
    <div>
      <h3>Your call options</h3>
      {loading ? (
        <p>Loading...</p>
      ) : callOptions.length == 0 ? (
        <p>No call options</p>
      ) : (
        <ul>
          {callOptions.map(({ orderHash, orderDetails }) => (
            <li key={orderHash}>
              #{orderHash.slice(0, 6)} //{" "}
              {constants.MaxUint256.sub(
                BigNumber.from(orderDetails.erc721Assets[0].tokenId)
              ).toString()}{" "}
              wheyfus //{" "}
              <a href={`https://putty.finance/order/${orderHash}`}>
                View on putty
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
