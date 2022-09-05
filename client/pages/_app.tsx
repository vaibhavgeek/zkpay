import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { MetaMaskProvider } from "metamask-react";

function MyApp({ Component, pageProps }: AppProps) {
  return (<MetaMaskProvider><ChakraProvider><Component {...pageProps} /></ChakraProvider></MetaMaskProvider>)
}

export default MyApp
