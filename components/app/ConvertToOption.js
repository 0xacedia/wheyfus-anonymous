import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useSigner } from "wagmi";
import wheyfuAbi from "../../contracts/wheyfu.abi.json";
import { ConnectWalletButton } from "../core/ConnectWalletButton";

const useConvertToOption = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: address,
    token: process.env.NEXT_PUBLIC_CALLOPTION_TOKEN_ADDRESS,
  });

  const { data: signer } = useSigner();
  const convertToOption = async (amount) => {
    const wheyfu = new Contract(
      process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
      wheyfuAbi,
      signer
    );

    try {
      const tx = await wheyfu.convertToOption(
        amount,
        Math.floor(Math.random() * 100)
      );
      await tx.wait();
      alert(`confirmed tx: created #${amount} wheyfu call options `);
    } catch (e) {
      console.error(e);
      console.log(e.message);
      alert("error: " + (e.reason || e.message || e.toString()));
    }
  };

  return [balance, convertToOption];
};

export const ConvertToOption = () => {
  const [balance, convertToOption] = useConvertToOption();
  const [amount, setAmount] = useState();

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <h3>Convert option tokens to actual options</h3>
      <input
        placeholder="enter amount of tokens"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <ConnectWalletButton>
        <button onClick={() => convertToOption(amount)}>convert</button>
      </ConnectWalletButton>
      <p>Your call option token balance: {balance?.formatted} tokens</p>

      <img
        style={{ position: "absolute", right: -400, bottom: 0 }}
        src="/love-dance.gif"
        alt="cute love gif"
        height={120}
      />
    </div>
  );
};
