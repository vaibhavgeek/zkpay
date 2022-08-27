import { EasyLink } from "../contracts/types";
import { Web3Provider } from "@ethersproject/providers";
import { DepositEvent } from "../contracts/types/contracts/EasyLink";
import { getEvents, getLastBlock, LocalStoredEvent, saveEvents, saveLastBlock } from "./storage";

export const populateEvents = async (easyLink: EasyLink, chainId: string, provider: Web3Provider) => {
  const events = getEvents(chainId);
  const lastBlock = getLastBlock(chainId);

  let startBlock = lastBlock + 1;
  const currentBlock = await provider.getBlockNumber();

  while (startBlock < currentBlock) {
    const endBlock = Math.min(startBlock + 1000, currentBlock);
    console.log("Searching events from", startBlock, "to", endBlock);
    const rangeEvents = (await easyLink.queryFilter(easyLink.filters.Deposit(), startBlock, endBlock))
      .map((it: DepositEvent) => ({
        commitment: it.args.commitment.toString(),
        index: it.args.index
      }) as LocalStoredEvent);
    events.push(...rangeEvents);

    saveEvents(chainId, events);
    saveLastBlock(chainId, endBlock);

    startBlock = endBlock;
  }

  return events;
}