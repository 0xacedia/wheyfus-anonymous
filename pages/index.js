import { AddLiquidityAndStake } from "../components/app/AddLiquidityAndStake";
import { Bonds } from "../components/app/Bonds";
import { CallOptions } from "../components/app/CallOptions";
import { ConvertToOption } from "../components/app/ConvertToOption";
import { Explainer } from "../components/app/Explainer";
import { Mint } from "../components/app/Mint";
import { Socials } from "../components/app/Socials";
import { WithdrawLiquidity } from "../components/app/WithdrawLiquidity";
import { ConnectWalletButton } from "../components/core/ConnectWalletButton";

export default function Home() {
  return (
    <div>
      <h1>Welcome to wheyfus anonymous :3</h1>
      <p>A friendly group of really healthy 2d grils</p>
      <Socials />
      <ConnectWalletButton />
      <Mint />
      <AddLiquidityAndStake />
      <WithdrawLiquidity />
      <Explainer />
      <Bonds />
      <ConvertToOption />
      <CallOptions />
    </div>
  );
}
