import { useState } from "react";
import { usePool } from "../../hooks/usePool";
import { ConnectWalletButton } from "../core/ConnectWalletButton";

export const WithdrawLiquidity = () => {
  const [amount, setAmount] = useState();
  const { price, lpTokenSupply, nftReserves } = usePool();

  return (
    <div>
      <h3>Withdraw liquidity</h3>
      <input
        id="withdraw-amount"
        placeholder="amount of wheyfus"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />

      <ConnectWalletButton>
        <button>withdraw liquidity</button>
      </ConnectWalletButton>

      <p>
        You receive: {amount || 0} wheyfus + {amount * price} ether
      </p>

      <p>
        Cost: {(lpTokenSupply * amount) / nftReserves} lp tokens (your balance:
        100 lp tokens)
      </p>
    </div>
  );
};
