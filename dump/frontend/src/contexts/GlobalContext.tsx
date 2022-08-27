import { createContext, useMemo, useState } from "react";
import { ethers } from "ethers";
import { PoseidonHasher } from "../utils/hasher";
import { EasyLink, EasyLinkToken } from "../contracts/types";
import { useMetamaskProvider } from "../hooks/useMetamaskProvider";
import { CONTRACT_TO_ABI, CONTRACTS, easyLink, easyLinkToken } from "../utils/contracts";

const buildPoseidon = require("circomlibjs").buildPoseidon;

const hasher = new PoseidonHasher(await buildPoseidon());
export const GlobalContext = createContext<Context>({
  provider: undefined,
  chainId: undefined,
  connect: () => {
  },
  switchChain: () => {
  },
  hasher: hasher,
  easyLink: undefined,
  easyLinkToken: undefined,
  symbol: undefined
});

export interface Context {
  provider: ethers.providers.Web3Provider | undefined,
  chainId: string | undefined,
  connect: () => void,
  switchChain: (chainId: number) => void,
  hasher: PoseidonHasher,
  easyLink: EasyLink | undefined
  easyLinkToken: EasyLinkToken | undefined,
  symbol: string | undefined
}

export const GlobalContextProvider = ({ children }: any) => {

  const [provider, chainId, connect, switchChain] = useMetamaskProvider();
  const [symbol, setSymbol] = useState<string | undefined>();

  const easyLinkContract = useMemo(() => {
    console.log("easy link contract creation");
    if (!provider) {
      return;
    }

    const contract = CONTRACTS[easyLink][chainId];
    if (!contract) {
      console.log("Can't find contract for", easyLink, chainId);
      return;
    }

    return new ethers.Contract(contract.address, CONTRACT_TO_ABI[easyLink], provider.getSigner(0)) as EasyLink;
  }, [provider, chainId]);

  const easyLinkTokenContract = useMemo(() => {
    console.log("easy link contract creation");
    if (!provider) {
      return;
    }

    const contract = CONTRACTS[easyLinkToken][chainId];
    if (!contract) {
      console.log("Can't find contract for", easyLinkToken, chainId);
      return;
    }

    const tokenContract = new ethers.Contract(contract.address, CONTRACT_TO_ABI[easyLinkToken],
      provider.getSigner(0)) as EasyLinkToken;

    tokenContract.symbol()
      .then(it => setSymbol(it));

    return tokenContract;
  }, [provider, chainId]);

  return (
    <GlobalContext.Provider value={{
      provider,
      chainId,
      connect,
      switchChain,
      hasher,
      easyLink: easyLinkContract,
      easyLinkToken: easyLinkTokenContract,
      symbol
    }}>
      {children}
    </GlobalContext.Provider>
  );
}