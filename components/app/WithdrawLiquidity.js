import { formatEther } from "ethers/lib/utils";
import { useState } from "react";
import { useAccount, useBalance, useSigner } from "wagmi";
import { usePool } from "../../hooks/usePool";
import { ConnectWalletButton } from "../core/ConnectWalletButton";
import wheyfuAbi from "../../contracts/wheyfu.abi.json";
import { Contract } from "ethers";

export const WithdrawLiquidity = () => {
  const [amount, setAmount] = useState();
  const { price, lpTokenSupply, nftReserves, wheyfus, loadingNfts } = usePool();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: address,
    token: process.env.NEXT_PUBLIC_LP_TOKEN_ADDRESS,
  });

  const formattedPrice = formatEther(price || "0");
  const formattedLpTokenSupply = formatEther(lpTokenSupply || "0");

  const { data: signer } = useSigner();
  const removeLiquidity = async () => {
    const wheyfu = new Contract(
      process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
      wheyfuAbi,
      signer
    );

    try {
      const tokenIds = wheyfus
        .slice(0, 0 + amount)
        .map(({ tokenId }) => tokenId);
      const tx = await wheyfu.removeLiquidity(tokenIds, price, price);
      await tx.wait();
      alert(`confirmed tx: withdraw #${amount} wheyfus of liquidity`);
    } catch (e) {
      console.error(e);
      console.log(e.message);
      alert("error: " + (e.reason || e.message || e.toString()));
    }
  };

  return (
    <div>
      <h3>Withdraw liquidity</h3>
      {loadingNfts ? (
        "Loading NFTs that can be withdrawn - may take a few secs (ɔ◔‿◔)ɔ ♥..."
      ) : (
        <>
          {" "}
          <input
            id="withdraw-amount"
            placeholder="amount of wheyfus"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <ConnectWalletButton>
            <button onClick={() => removeLiquidity()}>
              withdraw liquidity
            </button>
          </ConnectWalletButton>
        </>
      )}

      <p>
        You receive: {amount || 0} wheyfus + {amount * formattedPrice} ether
      </p>

      <p>
        Cost: {(formattedLpTokenSupply * amount) / nftReserves} lp tokens (your
        balance: {balance?.formatted} lp tokens)
      </p>
    </div>
  );
};
