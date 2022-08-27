import { CONTRACTS, easyLink } from "./contracts";

const EASY_LINK_EVENTS_KEY = "easyLink:events";
const EASY_LINK_EVENTS_LAST_BLOCK_KEY = "easyLink:eventsLastBlock";

export interface LocalStoredEvent {
  commitment: string,
  index: number,
}

export const getEvents = (chainId: string): LocalStoredEvent[] => {
  return JSON.parse(localStorage.getItem(`${EASY_LINK_EVENTS_KEY}:${chainId}`) || "[]") as LocalStoredEvent[];
}

export const saveEvents = (chainId: string, events: LocalStoredEvent[]) => {
  localStorage.setItem(`${EASY_LINK_EVENTS_KEY}:${chainId}`, JSON.stringify(events));
}

export const getLastBlock = (chainId: string): number => {
  const deploymentBlock = CONTRACTS[easyLink][chainId].deploymentBlock;
  if (!deploymentBlock) {
    throw Error('DeploymentBlock is not setup for chainId=\'' + chainId + '\'');
  }

  return parseIntSafe(localStorage.getItem(`${EASY_LINK_EVENTS_LAST_BLOCK_KEY}:${chainId}`)) || deploymentBlock;
}

export const saveLastBlock = (chainId: string, blockNumber: number) => {
  localStorage.setItem(`${EASY_LINK_EVENTS_LAST_BLOCK_KEY}:${chainId}`, blockNumber.toString());
}

const parseIntSafe = (item: string | null) => {
  if (item) {
    return parseInt(item);
  }
  return undefined;
}