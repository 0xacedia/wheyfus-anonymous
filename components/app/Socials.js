import Link from "next/link";

export const Socials = () => {
  return (
    <div>
      <h3>Socials</h3>
      <ul>
        <li>
          <a
            href={`https://sudoswap.xyz/#/browse/buy/${process.env.NEXT_PUBLIC_WHEYFU_ADDRESS}`}
          >
            sudoswap
          </a>
        </li>
        <li>
          <a href="https://putty.finance">putty</a>
        </li>
        <li>
          <a href="https://twitter.com">twitter (not ready yet)</a>
        </li>
        <li>
          <a href="https://discord.com">discord (not ready yet)</a>
        </li>
        <li>
          <Link href="/docs">docs</Link>
        </li>
      </ul>
    </div>
  );
};
