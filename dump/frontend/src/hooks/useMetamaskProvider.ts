import { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { CHAINS } from "../utils/chains";

export const useMetamaskProvider = (): [
    Web3Provider | undefined,
  string,
  () => void,
  (chainId: number) => void
] => {

  const [provider, setProvider] = useState<Web3Provider | undefined>();
  const [chainId, setChainId] = useState<string>("");

  const connect = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setProvider(new Web3Provider(window.ethereum));
      const chainId = await getChainId();
      setChainId(parseInt(chainId, 16).toString());
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  const switchChain = async (requestedChainId: number) => {
    if (!window.ethereum) {
      console.log('Metamask is missing');
      return;
    }

    if (!provider) {
      console.log('Wallet not connected');
      return;
    }

    const requestedChainIdHex = '0x' + requestedChainId.toString(16);
    if (await getChainId() === requestedChainIdHex) {
      return;
    }

    try {
      await switchEthereumChain(requestedChainIdHex);
    } catch (e: any) {
      if (e.code === 4902) {
        await addChainId(requestedChainIdHex);
      } else {
        throw e;
      }
    }
    setChainId(requestedChainId.toString());
    setProvider(new Web3Provider(window.ethereum));
  }

  const getChainId = async () => {
    return await window.ethereum.request({ method: 'eth_chainId' });
  }

  const switchEthereumChain = async (chainId: string) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }],
    });
  }

  const addChainId = async (chainId: string) => {
    const chain = CHAINS[parseInt(chainId, 16).toString()];
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainId,
          chainName: chain.chainName,
          rpcUrls: [chain.rpcUrl],
          blockExplorerUrls: [chain.blockExplorerUrl],
          nativeCurrency: {
            symbol: chain.nativeCurrency,
            decimals: chain.nativeCurrencyDecimals
          }
        }]
    });
  }

  return [provider, chainId, connect, switchChain];
}