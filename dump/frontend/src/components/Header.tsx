import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Center, Link, Text } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { shortenAddress } from "../utils/address";
import { GlobalContext } from "../contexts/GlobalContext";
import { GroupBase, OnChangeValue, OptionBase, Select } from "chakra-react-select";
import { CHAINS, isTestnet } from "../utils/chains";
import { ethers } from "ethers";

interface NetworkOption extends OptionBase {
  label: string;
  value: string;
}

const Header = () => {
  const router = useRouter();

  const { provider, chainId, connect, switchChain, easyLinkToken: easyLinkToken } = useContext(GlobalContext);
  const [account, setAccount] = useState<string>();
  const [mintLoading, setMintLoading] = useState<boolean>();
  const [networkOptions, setNetworkOptions] = useState<GroupBase<NetworkOption>[]>([]);

  useEffect(() => {
    if (!account && provider) {
      provider.getSigner(0).getAddress()
        .then((account: string) => {
          setAccount(account);
        });
    }
  })

  const connectWallet = async () => {
    await connect();
  }

  const switchChainLocal = (e: OnChangeValue<NetworkOption, false>) => {
    if (!e) {
      return;
    }
    switchChain(parseInt(e.value));
  }

  const getTestTokens = async () => {
    if (!easyLinkToken) {
      console.log("getTestTokens() no easyLinkToken");
      return;
    }

    setMintLoading(true);
    try {
      const mint = await easyLinkToken.mint(ethers.utils.parseEther("10"));
      await mint.wait(1);
    } finally {
      setMintLoading(false);
    }
  }

  useEffect(() => {
    const mainNetworks: NetworkOption[] = [];
    const testNetworks: NetworkOption[] = [];
    Object.entries(CHAINS).forEach(entry => {
      const option = {
        label: entry[1].chainName,
        value: entry[0]
      };

      if (entry[1].testnet) {
        testNetworks.push(option);
      } else {
        mainNetworks.push(option)
      }
    })

    setNetworkOptions([
      {
        label: "mainnets",
        options: mainNetworks
      },
      {
        label: "testnets",
        options: testNetworks
      }
    ]);
  }, []);

  return (
    <>
      <Box
        bg={'gray.900'}
        display="flex"
        justifyContent={"space-between"}
        px="10%"
        py="20px"
        borderBottomWidth="1px"
      >
        <Center>
          <Link onClick={() => router.push("/")}>
            <Text fontSize="2xl">EasyLink</Text>
          </Link>
        </Center>
        <Center textAlign="right">
          {
            isTestnet(chainId) &&
            <Center w={'13rem'}>
              <Button isLoading={mintLoading} onClick={getTestTokens}>Get test ELT</Button>
            </Center>
          }
          <Select<NetworkOption, false, GroupBase<NetworkOption>>
            isSearchable={false}
            blurInputOnSelect={true}
            isDisabled={!provider}
            isInvalid={provider && networkOptions.flatMap(it => it.options).filter(it => it.value === chainId).length === 0}
            value={networkOptions.flatMap(it => it.options).filter(it => it.value === chainId)}
            options={networkOptions}
            onChange={switchChainLocal}
            chakraStyles={{
              container: (provided) => ({
                ...provided,
                w: '13rem',
              }),
              menuList: (provided) => ({
                ...provided,
                minW: '',
              }),
            }}
            placeholder="Select network"
            closeMenuOnSelect={true}
            selectedOptionColor="green"/>
          <Center w={'13rem'}>
            {
              account ?
                shortenAddress(account) :
                <Button onClick={connectWallet} textAlign="center">Connect wallet</Button>
            }
          </Center>
        </Center>
      </Box>
    </>
  );
};

export default Header;
