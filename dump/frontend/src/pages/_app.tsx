import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { GlobalContextProvider } from "../contexts/GlobalContext";
import Layout from "../components/Layout";
import Fonts from "../components/Fonts";
import { theme } from "../themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts/>
      <Head>
        <title>EasyLink</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <GlobalContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalContextProvider>
    </ChakraProvider>
  );
}

export default MyApp
