export const Socials = () => {
  return (
    <div>
      <h3>Socials</h3>
      <ul>
        <li>
          <a
            href={`https://sudoswap.xyz/#/swap/${process.env.NEXT_PUBLIC_SUDO_POOL_ADDRESS}`}
          >
            sudoswap (custom*)
          </a>
        </li>
        <li>
          <a href="https://rinkeby.putty.finance">putty</a>
        </li>
        <li>
          <a href="https://twitter.com">twitter</a>
        </li>
        <li>
          <a href="https://discord.com">discord</a>
        </li>
      </ul>

      <p>
        *sudoswap's frontend doesn't currently aggregate liquidity from pools
        using <br />
        the xyk curve so you have to interact directly with the pool using this
        link
      </p>
    </div>
  );
};
