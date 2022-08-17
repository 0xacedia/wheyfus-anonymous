import { useEffect, useState } from "react";
import { ConnectWalletButton } from "../core/ConnectWalletButton";
import wheyfuAbi from "../../contracts/wheyfu.abi.json";
import {
  useAccount,
  useBlockNumber,
  useContractRead,
  useProvider,
  useSigner,
} from "wagmi";
import { Contract } from "ethers";

const useMint = () => {
  const [amountLeft, setAmountLeft] = useState(0);
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const wheyfu = new Contract(
    process.env.NEXT_PUBLIC_WHEYFU_ADDRESS,
    wheyfuAbi,
    signer
  );

  const fetchAmount = async () => {
    const amount = await wheyfu.mintWhitelist(address);
    setAmountLeft(amount.toNumber());
  };

  useEffect(() => {
    fetchAmount();
  }, [address, signer, blockNumber]);

  const mint = async (amount) => {
    try {
      const tx = await wheyfu.mint(amount);
      await tx.wait();
      alert(`confirmed tx: minted ${amount} wheyfus`);
    } catch (e) {
      console.error(e);
      console.log(e.message);
      alert("error: " + (e.reason || e.message || e.toString()));
    }
  };

  return { amountLeft, mint };
};

export const Mint = () => {
  const { amountLeft, mint } = useMint();
  const [amount, setAmount] = useState();

  console.log("amount left", amountLeft);

  return (
    <div>
      <h3>Mint (uwu)</h3>
      <p>Invite only</p>
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
