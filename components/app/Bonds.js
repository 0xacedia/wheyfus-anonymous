import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useBonds = () => {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const [bonds, setBonds] = useState([]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setBonds([
        {
          tokenId: "0x0128391283",
          amount: 120938.9283,
          duration: 60 * 60 * 24 * 18,
          expiration: new Date().getTime() + 60 * 60 * 24 * 18 * 1000,
          earned: 10923.921,
        },
        {
          tokenId: "0x012823391283",
          amount: 120938.9283,
          duration: 60 * 60 * 24 * 18,
          expiration: new Date().getTime() - 60 * 60 * 24 * 18 * 1000,
          earned: 10923.921,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [address]);

  return [bonds, loading];
};

export const Bonds = () => {
  const [bonds, loading] = useBonds();

  return (
    <div>
      <h3>Your bonds</h3>
      {loading ? (
        <p>Loading ur bonds...</p>
      ) : bonds.length == 0 ? (
        <p>No bonds</p>
      ) : (
        <ul>
          {bonds.map(({ tokenId, amount, duration, expiration, earned }) => (
            <li key={tokenId}>
              {amount} lp tokens // {(duration / 60) * 60 * 24} days // mat.{" "}
              {Date.now() > expiration
                ? "MATURED!"
                : new Date(expiration).toISOString()}{" "}
              // yield: {earned} call tokens
              {Date.now() > expiration && <button>claim</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
