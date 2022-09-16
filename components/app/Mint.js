import { useEffect, useState } from "react";
import { ConnectWalletButton } from "../core/ConnectWalletButton";
import mintAbi from "../../contracts/mint.abi.json";
import { useAccount, useBlockNumber, useSigner } from "wagmi";
import { Contract } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const useMint = () => {
  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProof, setLoadingProof] = useState(false);
  const [amountLeft, setAmountLeft] = useState(0);
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const generateMerkleProof = (target) => {
    const leaves = whitelist.map((v) => keccak256(v));
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    const proof = tree.getHexProof(keccak256(target));

    return proof;
  };

  useEffect(() => {
    setLoading(true);
    import("./whitelist.json").then((w) => {
      setWhitelist(w.addresses);
      setLoading(false);
    });
  }, []);

  const mintContract = new Contract(
    process.env.NEXT_PUBLIC_MINT_ADDRESS,
    mintAbi,
    signer
  );

  const isWhitelisted = whitelist.some(
    (v) => v.toLowerCase() === address?.toLowerCase()
  );

  const fetchAmount = async () => {
    const amount = (await mintContract.MAX_MINT_AMOUNT()).sub(
      await mintContract.minted(address)
    );

    setAmountLeft(isWhitelisted ? amount.toNumber() : 0);
  };

  useEffect(() => {
    if (address) fetchAmount();
  }, [address, signer, blockNumber, whitelist]);

  const mint = async (amount) => {
    try {
      setLoadingProof(true);
      await new Promise((r) => setTimeout(() => r(), 100));
      const proof = generateMerkleProof(address);
      setLoadingProof(false);
      const tx = await mintContract.mint(amount, proof);
      await tx.wait();
      alert(`confirmed tx: minted ${amount} wheyfus`);
    } catch (e) {
      console.error(e);
      console.log(e.message);
      alert("error: " + (e.reason || e.message || e.toString()));
    }
  };

  return { amountLeft, mint, isWhitelisted, loading, loadingProof };
};

export const Mint = () => {
  const { address } = useAccount();
  const { amountLeft, mint, isWhitelisted, loading, loadingProof } = useMint();
  const [amount, setAmount] = useState();

  return (
    <div>
      <h3>Mint (uwu)</h3>

      {address && (
        <p>
          {loading
            ? "Checking if you are whitelisted..."
            : `You are ${
                isWhitelisted ? "whitelisted! ^_^" : "not whitelisted"
              }`}
        </p>
      )}

      <p>If you did any of the following you are whitelisted!</p>
      <ul>
        <li>Participated in TheDAO in 2016</li>
        <li>Traded on etherdelta 2017</li>
        <li>Transferred link in 2018</li>
        <li>Swapped on uni in 2019</li>
        <li>Farmed sushi in 2020</li>
        <li>Bonded in olympus in 2021</li>
      </ul>

      <label htmlFor="mint-amount">You can mint {amountLeft} wheyfus: </label>
      <input
        id="mint-amount"
        placeholder="enter amount to mint"
        type="number"
        onChange={(e) => setAmount(e.target.value)}
      />
      <ConnectWalletButton>
        <button onClick={() => mint(amount)}>mint</button>
      </ConnectWalletButton>
      {loadingProof && (
        <p>Constructing whitelist proof, may take a few seconds... (ɔ◔‿◔)ɔ ♥</p>
      )}
    </div>
  );
};
