import { CONTRACTS, ZKPayLinkConstant } from "./contracts";

const ZKPAYLINK_EVENTS = "ZKPayLinkConstant:events";
const ZKPAY_LINK_EVENTS_LAST_BLOCK_KEY = "ZKPayLinkConstant:eventsLastBlock";

export interface LocalStoredEvent {
  commitment: string,
  index: number,
}

export const getEvents = (chainId: string): LocalStoredEvent[] => {
  return JSON.parse(localStorage.getItem(`${ZKPAYLINK_EVENTS}:${chainId}`) || "[]") as LocalStoredEvent[];
}

export const saveEvents = (chainId: string, events: LocalStoredEvent[]) => {
  localStorage.setItem(`${ZKPAYLINK_EVENTS}:${chainId}`, JSON.stringify(events));
}

export const getLastBlock = (chainId: string): number => {
  const deploymentBlock = CONTRACTS[ZKPayLinkConstant][chainId].deploymentBlock;
  if (!deploymentBlock) {
    throw Error('DeploymentBlock is not setup for chainId=\'' + chainId + '\'');
  }

  return parseIntSafe(localStorage.getItem(`${ZKPAY_LINK_EVENTS_LAST_BLOCK_KEY}:${chainId}`)) || deploymentBlock;
}

export const saveLastBlock = (chainId: string, blockNumber: number) => {
  localStorage.setItem(`${ZKPAY_LINK_EVENTS_LAST_BLOCK_KEY}:${chainId}`, blockNumber.toString());
}

const parseIntSafe = (item: string | null) => {
  if (item) {
    return parseInt(item);
  }
  return undefined;
}