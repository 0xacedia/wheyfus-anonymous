import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { useAlchemy } from "../../hooks/useAlchemy";
import { usePool } from "../../hooks/usePool";
import { ConnectWalletButton } from "../core/ConnectWalletButton";
import wheyfuAbi from "../../contracts/wheyfu.abi.json";
import { formatEther } from "ethers/lib/utils";
import { TERMS } from "../../constants";
import { useNfts } from "../../hooks/useNfts";

const limit = 6;
const WheyfuSelect = ({ onChange, value }) => {
  const [offset, setOffset] = useState(0);
  const { address } = useAccount();
  const [wheyfus, loading] = useNfts({
    offset,
    limit,
    address: process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
    tokenAddress: process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
  });

  return (
    <div>
      <b>Select some of your wheyfus to LP --</b>
      <div
        style={{
          display: "flex",
          margin: "12px 0",
          maxWidth: "100%",
          flexWrap: "wrap",
        }}
      >
        {loading
          ? "loading wheyfus..."
          : wheyfus.length == 0
          ? "You dont have any wheyfus (hmph!)"
          : wheyfus.map(({ image, tokenId }, i) => {
              const selected = value.includes(tokenId);

              return (
                <img
                  style={{
                    height: 300,
                    marginRight: 12,
                    marginBottom: 12,
                    cursor: "pointer",
                    border: selected ? "2px dashed red" : "none",
                  }}
                  src={image}
                  key={tokenId}
                  onClick={() =>
                    onChange((old) =>
                      selected
                        ? old.filter((v) => v !== tokenId)
                        : old.concat(tokenId)
                    )
                  }
                />
              );
            })}
      </div>

      {offset > 0 && (
        <button
          style={{ marginRight: 12 }}
          onClick={() => setOffset(offset - limit)}
        >
          {"<<"}
        </button>
      )}
      <button onClick={() => setOffset(offset + limit)}>{">>"}</button>
    </div>
  );
};

export const AddLiquidityAndStake = () => {
  const [tokenIds, setTokenIds] = useState([]);
  const [termIndex, setTermIndex] = useState(1);
  const { price } = usePool();
  const { data: signer } = useSigner();

  const addLiquidityAndStake = async () => {
    const wheyfu = new Contract(
      process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
      wheyfuAbi,
      signer
    );

    try {
      const tx = await wheyfu.addLiquidityAndStake(
        tokenIds,
        price,
        price,
        termIndex,
        {
          value: price.mul(tokenIds.length),
        }
      );
      await tx.wait();
      alert(`Confirmed tx: Staked and LP'd ${tokenIds.length} wheyfus`);
    } catch (e) {
      console.error(e);
      alert("error: " + (e.reason || e.message || e.toString()));
    }
  };

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <h3>Add liquidity to sudo and stake!</h3>
      <p>
        boosted sudoswap shared LP fixed term zero coupon bonds that yield call
        options ("BSSLFTZCB" for short)
      </p>

      <WheyfuSelect value={tokenIds} onChange={setTokenIds} />

      <p>
        LP amount: {tokenIds.length} wheyfus +{" "}
        {formatEther(price) * tokenIds.length} ether
      </p>

      <select onChange={(e) => setTermIndex(e.target.value)} value={termIndex}>
        {TERMS.map(({ text }, termIndex) => (
          <option value={termIndex} key={termIndex}>
            {text}
          </option>
        ))}
      </select>

      <ConnectWalletButton>
        <button onClick={() => addLiquidityAndStake()}>LP and bond</button>
      </ConnectWalletButton>

      <img
        style={{ position: "absolute", right: 96, bottom: 0 }}
        src="/zeref-dancing.gif"
        alt="cute gif"
        height={120}
      />
    </div>
  );
};
