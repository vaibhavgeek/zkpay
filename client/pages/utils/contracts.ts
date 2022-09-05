import ZKPayLink from "../../../artifacts/contracts/ZKPayLink.sol/ZKPayLink.json";
import ZKPayToken from "../../../artifacts/contracts/ZKPayToken.sol/ZKPayToken.json";

export const ZKPayLinkConstant = 'ZKPayLink';
export const ZKPayTokenConstant = 'ZKPayToken';

export const CONTRACTS: {
  [name: string]: {
    [chainId: string]: {
      address: string,
      deploymentBlock?: number
    }
  }
} = {
  [ZKPayLinkConstant]: {
    ["PolygonMumbai"]: {
      address: '0xBE5B8eb4551C29E517Eb1a955C28010ED21bCe3d',
      deploymentBlock: 26147022
    },
    ["AuroraTestnet"]: {
      address: '0xC51f575D55fea243Cc8eC3CB6bb9B2533C14911e',
      deploymentBlock: 24697828
    },
  },
  [ZKPayTokenConstant]: {
    ["PolygonMumbai"]: {
      address: '0xaF65309a9dB2f9583b27ab9c70BF9996a41A3a40',
    },
    ["AuroraTestnet"]: {
      address: '0x4388Ab35c79e4e7f43972eF9A536309d574dEacB',
    },
  }
}


export const CONTRACT_TO_ABI: { [n: string]: any } = {
    [ZKPayLinkConstant]: [...ZKPayLink.abi],
    [ZKPayTokenConstant]: [...ZKPayToken.abi]
  }
