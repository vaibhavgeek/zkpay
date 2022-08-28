import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MetaMaskProvider } from "metamask-react";
function MyApp({ Component, pageProps }: AppProps) {
  return <MetaMaskProvider>
    <Component {...pageProps} />
  </MetaMaskProvider>
}

export default MyApp
