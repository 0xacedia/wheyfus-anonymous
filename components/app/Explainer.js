export const Explainer = () => {
  return (
    <div>
      <h3>Here's how it werks</h3>
      <ol>
        <li>You mint some wheyfu's</li>
        <li>
          Take equal parts wheyfus and eth and LP them into a shared{" "}
          <a
            href={`https://sudoswap.xyz/#/browse/buy/${process.env.NEXT_PUBLIC_SUDO_POOL_ADDRESS}`}
          >
            sudoswap
          </a>{" "}
          pool.
        </li>
        <li>Receive some LP tokens representing your share in the pool.</li>
      </ol>

      <ol start="4">
        <li>a: Take those LP tokens and bond them for a fixed term.</li>
        <li>
          a: At bond maturity, claim back your LP tokens + call option tokens
          for MOARRR wheyfus.
        </li>
        <li>
          a: Convert those call option tokens into actual call options via{" "}
          <a href="https://putty.finance">putty</a>.
        </li>
        <li>a: Exercise the call options.</li>
        <li>a: With your new wheyfus you can then go back to step 2.</li>
      </ol>

      <ol start="4">
        <li>
          b: Take those LP tokens and bond them for a fixed term in xyk pool fee
          bonds.
        </li>
        <li>
          b: At bond maturity, claim back your LP tokens + fees generated from
          the shared xyk sudo pool.
        </li>
        <li>b: With ur new eth go back to step 2.</li>
      </ol>

      <ul>
        <li>The longer you bond, the higher your relative yield boost.</li>
        <li>
          Each option expires in 5 years and has a strike of N wheyfus * 0.1
          ether.
        </li>
        <li>
          18000 wheyfus in the form of option contracts are distributed over 900
          days.
        </li>
        <li>
          The yield from LP fee bonds is boosted by liquidity staked in call
          option bonds.
        </li>
      </ul>

      <i>GOT IT? noice *starts twerking*</i>
    </div>
  );
};
