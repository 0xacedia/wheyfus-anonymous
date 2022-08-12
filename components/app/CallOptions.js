import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useCallOptions = () => {
  const [loading, setLoading] = useState(false);
  const [callOptions, setCallOptions] = useState([]);
  const { address } = useAccount();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCallOptions([
        {
          tokenId: "0x81293",
          amount: 123,
        },
        {
          tokenId: "0x812293",
          amount: 12,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [address]);

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
          {callOptions.map(({ tokenId, amount }) => (
            <li key={tokenId}>
              #{tokenId} // {amount} wheyfus //{" "}
              <a href="https://putty.finance">View on putty</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
