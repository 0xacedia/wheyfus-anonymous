export default function Docs() {
  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Docs</h1>

      <p>
        hiya! ~~ welcome to wheyfus :3 ~ <br />
        just a bunch of cute (read: fit) girls living in the second dimension.
      </p>

      <hr />

      <p>
        ok. ive been tasked with writing the docs. so here i'll prefix with a
        personal message. before continuing i want to say thtat i believe in
        both privacy and freedom. i think it's a disgrace that ross ulbricht is
        locked up. i also think its a disgrace that tcash is sanctioned.
        Obligatory examlep of govt incompetence:{" "}
        <a href="https://en.wikipedia.org/wiki/Greek_government-debt_crisis#Chronology">
          https://en.wikipedia.org/wiki/Greek_government-debt_crisis#Chronology
        </a>
        <br />
        ok sorry, that's it - i'll avoid schizo posting here.
      </p>

      <h2>Mechanism overview</h2>

      <p>
        Wheyfus is an NFT collection with a max supply of 30,000. 9000 is
        distributed via a free mint. 18000 is reserved for yield farming
        (distributed over 900 days). 3000 is minted to the team. Yield farming
        works by LP'ing into a shared xyk curve sudo pool then locking up the LP
        tokens for a fixed bond duration. The duration is variable (0 days, 30
        days, 90 days etc.). The longer you bond for, the higher your yield
        boost. The bonds yield call option tokens which can be converted 1:1 for
        putty call options on wheyfus. Each call option expires in 5 years and
        has a strike of 0.1 eth. There is also LP fee farming. This works
        similarly by LP'ing into a shared xyk curve sudo pool and also locking
        up LP tokens for a fixed bond duration. Except this time, instead of
        yield farming call option tokens, you yield farm the fees generated from
        the sudoswap pool. Fees are distributed pro rata based on the amount
        already staked and your yield boost. So there are 2 farms. 1 yielding
        call option tokens and 1 yielding sudoswap LP fees.
      </p>
      <i>
        note: The yield from the LP farm is boosted by the yield from the staked
        LP tokens in the call option farm. This is because LPs in the call
        option farm don't receive any LP fees; instead opting for call option
        yield.
      </i>

      <h2>
        <pre>OptionBonding.sol</pre>
      </h2>

      <p>
        LP's stake their LP tokens for preset bond durations. In return they
        receive call option token rewards which are distributed linearly over
        time. Option token rewards can be claimed after the bond matures. The
        longer the bond duration, the higher the yield boost. The option ERC20
        tokens can be converted for actual call option contracts on putty via
        the <pre>convertToOption()</pre> method. Each call option has a strike
        of 0.1 ether per NFT and expires in 5 years from now. When the option is
        exercised, the wheyfus are minted to your wallet.
      </p>

      <h2>
        <pre>FeeBonding.sol</pre>
      </h2>

      <p>
        LP's stake their LP tokens for preset bond durations. In return they
        receive fee rewards from the shared sudo xyk pool. Fees can be claimed
        after the bond matures. The longer the bond duration, the higher the
        yield boost. Fees are distributed via the <pre>skim()</pre> method. This
        method can be called by anyone at any time.
      </p>
    </div>
  );
}
