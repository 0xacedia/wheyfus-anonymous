import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { useAlchemy } from "../../hooks/useAlchemy";
import wheyfuAbi from "../../contracts/wheyfu.abi.json";
import { formatEther } from "ethers/lib/utils";
import { TERMS } from "../../constants";

const useBonds = (bondType) => {
  const isFeeBond = bondType === "FEE";
  const { address } = useAccount();
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(false);
  const provider = useProvider();
  const { data: signer } = useSigner();
  const alchemy = useAlchemy();

  const wheyfu = new Contract(
    process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
    wheyfuAbi,
    signer || provider
  );

  const claim = async (tokenId) => {
    try {
      const method = isFeeBond ? "feeUnstake" : "optionUnstake";
      const tx = await wheyfu[method](tokenId);
      await tx.wait();
      alert(`confirmed tx: claimed bond #${tokenId}`);
    } catch (e) {
      console.error(e);
      console.log(e.message);
      alert("error: " + (e.reason || e.message || e.toString()));
    }
  };

  const fetchBonds = async () => {
    setLoading(true);

    if (address) {
      // fetch address wheyfus
      let cachedPageKey;
      const raw = [];
      do {
        const { pageKey, ownedNfts } = await alchemy.nft.getNftsForOwner(
          address,
          {
            pageKey: cachedPageKey,
            contractAddresses: [
              isFeeBond
                ? process.env.NEXT_PUBLIC_FEE_BONDING_NFT_ADRESS
                : process.env.NEXT_PUBLIC_OPTION_BONDING_NFT_ADDRESS,
            ],
            withMetadata: true,
          }
        );

        cachedPageKey = pageKey;

        raw = raw.concat(ownedNfts);
      } while (cachedPageKey);

      const bonds = await Promise.all(
        raw
          .sort((a, b) => a.tokenId - b.tokenId)
          .map(async ({ tokenId }) => {
            const bond = await wheyfu[isFeeBond ? "feeBonds" : "bonds"](
              tokenId
            );
            const earned = await wheyfu[
              isFeeBond ? "feeEarned" : "optionEarned"
            ](tokenId);
            const duration = TERMS[bond.termIndex].value;

            return {
              tokenId,
              depositAmount: formatEther(bond.depositAmount),
              depositTimestamp: bond.depositTimestamp,
              termIndex: bond.termIndex,
              earned: formatEther(earned),
              duration,
              expiration: (bond.depositTimestamp + duration) * 1000,
            };
          })
      );

      setBonds(bonds);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBonds();
  }, [address]);

  return [bonds, claim, loading];
};

export const Bonds = ({ bondType }) => {
  const isFeeBond = bondType === "FEE";
  const [bonds, claim, loading] = useBonds(bondType);

  return (
    <div>
      <h3>Your {isFeeBond ? "fee" : "call option"} bonds</h3>
      {loading ? (
        <p>Loading ur bonds...</p>
      ) : bonds.length == 0 ? (
        <p>No bonds</p>
      ) : (
        <ul>
          {bonds.map(
            ({ tokenId, depositAmount, duration, expiration, earned }) => (
              <li key={tokenId}>
                {Number(depositAmount).toFixed(4)} lp tokens //{" "}
                {duration / (60 * 60 * 24)} days // mat.{" "}
                {Date.now() > expiration
                  ? "MATURED!"
                  : new Date(expiration).toISOString()}{" "}
                // yield: {Number(earned).toFixed(4)}{" "}
                {isFeeBond ? "ETH" : "call tokens"}
                {Date.now() > expiration && (
                  <button onClick={() => claim(tokenId)}>claim</button>
                )}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};
