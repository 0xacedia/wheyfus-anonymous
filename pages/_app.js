import { BodyLayout } from "../components/layout/BodyLayout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <BodyLayout id="app-root">
      <Component {...pageProps} />
    </BodyLayout>
  );
}

export default MyApp;
