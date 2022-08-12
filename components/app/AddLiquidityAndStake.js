import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { usePool } from "../../hooks/usePool";
import { ConnectWalletButton } from "../core/ConnectWalletButton";

const limit = 6;
const useWheyfus = ({ offset }) => {
  const { address } = useAccount();
  const [wheyfus, setWheyfus] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMore = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);

    console.log("offset", offset);

    // dummy wheyfus
    const newWheyfus = [];
    for (let i = offset; i < offset + limit; i++) {
      // fetch tokenURI
      newWheyfus.push({
        image: "https://pbs.twimg.com/media/D-keKHaVUAA4qbZ.jpg",
        tokenId: i,
      });
    }

    setWheyfus(newWheyfus);

    if (address) {
      // fetch address wheyfus
    } else {
      // fetch the first n wheyfus
    }
  };

  useEffect(() => {
    fetchMore(offset);
  }, [address, offset]);

  return [wheyfus, loading];
};

const WheyfuSelect = ({ onChange, value }) => {
  const [offset, setOffset] = useState(0);
  const [wheyfus, loading] = useWheyfus({ offset });

  return (
    <div>
      <b>Select some of your wheyfus to LP --</b>
      <div style={{ display: "flex", margin: "12px 0" }}>
        {loading
          ? "loading wheyfus..."
          : wheyfus.length == 0
          ? "You dont have any wheyfus (hmph!)"
          : wheyfus.map(({ image, tokenId }, i) => {
              const selected = value.includes(tokenId);
              console.log(value[i], tokenId);

              return (
                <img
                  style={{
                    width: 100,
                    marginRight: 12,
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
  const { price } = usePool();

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <h3>Add liquidity to sudo and stake!</h3>
      <p>
        boosted sudoswap shared LP fixed term zero coupon bonds that yield call
        options ("BSSLFTZCB" for short)
      </p>

      <WheyfuSelect value={tokenIds} onChange={setTokenIds} />

      <p>
        LP amount: {tokenIds.length} wheyfus + {price * tokenIds.length} ether
      </p>

      <select>
        {[
          { text: "1 day (0% yield boost)" },
          { text: "30 days (20% yield boost)" },
          { text: "90 days (50% yield boost)" },
          { text: "180 days (100% boost)" },
          { text: "365 days (200% boost)" },
        ].map(({ text }, termIndex) => (
          <option value={termIndex} key={termIndex}>
            {text}
          </option>
        ))}
      </select>

      <ConnectWalletButton>
        <button>LP and bond</button>
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
