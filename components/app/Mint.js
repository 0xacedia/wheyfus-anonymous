import { useState } from "react";
import { ConnectWalletButton } from "../core/ConnectWalletButton";

const useMint = () => {
  const [amountLeft, setAmountLeft] = useState(0);
  const mint = () => {};

  return { amountLeft, mint };
};

export const Mint = () => {
  const { amountLeft, mint } = useMint();

  return (
    <div>
      <h3>Mint (uwu)</h3>
      <p>Invite only</p>
      <label for="mint-amount">You can mint {amountLeft} wheyfus: </label>
      <input id="mint-amount" placeholder="enter amount to mint" />
      <ConnectWalletButton>
        <button>mint</button>
      </ConnectWalletButton>
    </div>
  );
};
