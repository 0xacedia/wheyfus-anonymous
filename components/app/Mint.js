import { useEffect, useState } from "react";
import { ConnectWalletButton } from "../core/ConnectWalletButton";
import mintAbi from "../../contracts/mint.abi.json";
import whitelist from "./whitelist.json";
import { useAccount, useBlockNumber, useSigner } from "wagmi";
import { Contract } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const generateMerkleProof = (target) => {
  const { addresses } = whitelist;

  const leaves = addresses.map((v) => keccak256(v));
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const proof = tree.getHexProof(keccak256(target));

  return proof;
};

const useMint = () => {
  const [amountLeft, setAmountLeft] = useState(0);
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const mintContract = new Contract(
    process.env.NEXT_PUBLIC_MINT_ADDRESS,
    mintAbi,
    signer
  );

  const isWhitelisted = whitelist.addresses.some(
    (v) => v.toLowerCase() === address?.toLowerCase()
  );

  const fetchAmount = async () => {
    const amount = (await mintContract.MAX_MINT_AMOUNT()).sub(
      await mintContract.minted(address)
    );

    setAmountLeft(isWhitelisted ? amount.toNumber() : 0);
  };

  useEffect(() => {
    fetchAmount();
  }, [address, signer, blockNumber]);

  const mint = async (amount) => {
    try {
      const proof = generateMerkleProof(address);
      const tx = await mintContract.mint(amount, proof);
      await tx.wait();
      alert(`confirmed tx: minted ${amount} wheyfus`);
    } catch (e) {
      console.error(e);
      console.log(e.message);
      alert("error: " + (e.reason || e.message || e.toString()));
    }
  };

  return { amountLeft, mint, isWhitelisted };
};

export const Mint = () => {
  const { amountLeft, mint, isWhitelisted } = useMint();
  const [amount, setAmount] = useState();

  return (
    <div>
      <h3>Mint (uwu)</h3>
      <p>Premint invite only</p>

      <p>You are {isWhitelisted ? "whitelisted! ^_^" : "not whitelisted"}</p>
      {/* <p>If you did any of the following you are whitelisted!</p>
      <ul>
        <li>Participated in TheDAO in 2016</li>
        <li>Traded on etherdelta 2017</li>
        <li>Received link in 2018</li>
        <li>Swapped on uni in 2019</li>
        <li>Farmed sushi in 2020</li>
        <li>Bonded in olympus in 2021</li>
      </ul> */}
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
    </div>
  );
};
