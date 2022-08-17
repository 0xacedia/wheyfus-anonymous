import { useEffect, useMemo, useState } from "react";
import { useAlchemy } from "./useAlchemy";

export const useNfts = ({ offset, limit, address, tokenAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const alchemy = useAlchemy();

  const fetchMore = async () => {
    setLoading(true);

    console.log("fetching", address, tokenAddress);

    if (address) {
      // fetch address nfts
      let cachedPageKey;
      const raw = [];
      do {
        const { pageKey, ownedNfts } = await alchemy.nft.getNftsForOwner(
          address,
          {
            pageKey: cachedPageKey,
            contractAddresses: [tokenAddress],
            withMetadata: true,
          }
        );

        cachedPageKey = pageKey;

        raw = raw.concat(ownedNfts);
      } while (cachedPageKey);

      const nfts = raw
        .sort((a, b) => a.tokenId - b.tokenId)
        .map(({ tokenId, rawMetadata: { image } }) => ({ tokenId, image }));

      setNfts(nfts);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMore();
  }, [address, tokenAddress]);

  const subNfts = useMemo(
    () => nfts.slice(offset, offset + limit),
    [nfts, offset, limit]
  );

  console.log("nfts", tokenAddress, nfts, subNfts);

  return [subNfts, loading];
};
