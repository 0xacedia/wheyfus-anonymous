import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useConvertToOption = () => {
  const { address } = useAccount();
  const [callOptionBalance, setCallOptionBalance] = useState();

  useEffect(() => {
    setTimeout(() => {
      setCallOptionBalance(100.231);
    }, 1000);
  }, [address]);

  return [callOptionBalance];
};

export const ConvertToOption = () => {
  const [callOptionBalance] = useConvertToOption();

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <h3>Convert option tokens to actual options</h3>
      <input placeholder="enter amount of tokens" />
      <button>convert</button>
      <p>Your call option token balance: {callOptionBalance} tokens</p>

      <img
        style={{ position: "absolute", right: -400, bottom: 0 }}
        src="/love-dance.gif"
        alt="cute love gif"
        height={120}
      />
    </div>
  );
};
