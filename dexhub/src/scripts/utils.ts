import Web3 from 'web3';
import axios from 'axios';
import { networks } from './networks';
import BigNumber from 'bignumber.js';
import Manager from '#src/interfaces/Manager.json';
import Ierc20 from '#src/interfaces/Ierc20.json';
import { AbiItem } from 'web3-utils';
import { zeroAddress } from 'viem';
import database from './database';
import { AxiosResponse } from 'axios';
import { Trader, Stats, TraderHistory } from '#src/types';
import Avatar from '#src/assets/images/avatar.png';
import { PeriodValues } from '#src/components/period/types';

const web3: Web3 = new Web3(window.ethereum);
window.ethereum?.enable();

const adjustNumber = (number: number | string): number => {
  return Number(new BigNumber(number).div(BigNumber(10).pow(BigNumber(30))).toFixed(0));
};

const getUserAccount = async (user: string | undefined) => {
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  if (user) {
    const manager = new web3.eth.Contract(Manager as AbiItem[], networks[chainId].manager);
    return await manager.methods.userAccounts(user).call();
  } else return zeroAddress;
};

const addTrader = async (trader: string, wallet: string | undefined) => {
  let chain: string = '';
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  if (chainId == '42161') chain = 'arbitrum';
  else if (chainId == '43114') chain = 'avalanche';
  if (!/^[a-fA-F0-9x]+$/.test(trader) || trader.length != 42) {
    console.log('Invalid trader address');
  } else await database.addTrackedTraders(wallet, [trader], chain);
};

const removeTrader = async (trader: string, wallet: string | undefined) => {
  let chain: string = '';
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  if (chainId == '42161') chain = 'arbitrum';
  else if (chainId == '43114') chain = 'avalanche';
  await database.deleteTrackedTraders(wallet, [trader], chain);
};

const getFollowedTraders = async (wallet: string | undefined): Promise<string[]> => {
  let chain: string = '';
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  if (chainId == '42161') chain = 'arbitrum';
  else if (chainId == '43114') chain = 'avalanche';
  if (wallet) return await database.getTrackedTraders(wallet, chain);
  else return [];
};

const getAllowance = async (trader: string | undefined): Promise<number> => {
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  const collateral = new web3.eth.Contract(Ierc20 as AbiItem[], networks[chainId].usdc);
  const allowance: number = await collateral.methods.allowance(trader, networks[chainId].manager).call();
  const decimals: number = await collateral.methods.decimals().call();
  const derivative = allowance / 10 ** decimals;
  return parseFloat(derivative.toFixed(2));
};

const getWinLossCount = async (trader: string): Promise<Stats> => {
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  const url: string = networks[chainId].graphUrl;
  const query: string = `
    {
        trades(where: {account: "${trader}"}) {
          realisedPnl
        }
    }`;
  const response: AxiosResponse<any, any> = await axios.post(url, { query: query });
  const trades = response.data.data.trades;

  let winCount: number = 0;
  let lossCount: number = 0;
  let totalPnlCount: number = 0;

  trades.map((trade: any) => {
    Number(trade.realisedPnl) > 0 ? (winCount += 1) : (lossCount += 1);
    totalPnlCount += adjustNumber(trade.realisedPnl);
  });

  const stats = {
    win: winCount,
    loss: lossCount,
    totalPnl: totalPnlCount,
  };

  return stats;
};

const isTraderFollowed = async (trader: string, wallet: string | undefined): Promise<boolean> => {
  let chain: string = '';
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  if (chainId == '42161') chain = 'arbitrum';
  else if (chainId == '43114') chain = 'avalanche';
  const users = await database.getUsersByTrader(trader, chain);
  return users[0].includes(wallet);
};

const getTimestamp = (period: PeriodValues): number => {
  const currentTime: number = new Date().getTime();
  let offset: number = 0;
  if (period == 'day') offset = 60 * 60 * 24;
  else if (period == 'week') offset = 60 * 60 * 24 * 7;
  else return 0;
  return Number(Number((currentTime / 1000).toFixed()) - offset);
};

const getTraderList = async (wallet: string | undefined, sortBy: string, period: PeriodValues): Promise<Trader[]> => {
  const quantity: number = 100;
  const traderList: Trader[] = [];
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  const url: string = networks[chainId].graphUrl;
  const timestamp = getTimestamp(period);
  const query: string = `
    {
        trades(where: {timestamp_gt: ${timestamp}}, first: ${quantity}, orderBy: ${sortBy}, orderDirection: desc) {
          account
        }
    }`;
  const response: AxiosResponse<any, any> = await axios.post(url, { query: query });
  const trades = response.data.data.trades;
  const approve = await getAllowance(wallet);

  const tradersAddr: string[] = [];
  const traders = [];
  let count = 0;

  while (traders.length < 10 && trades.length > 0) {
    if (!tradersAddr.includes(trades[count].account)) {
      traders.push(trades[count]);
      tradersAddr.push(trades[count].account);
    }
    count += 1;
  }

  const statsPromises: Promise<Stats>[] = [];
  const followedPromises: Promise<boolean>[] = [];

  for (let trader of tradersAddr) {
    statsPromises.push(getWinLossCount(trader));
    followedPromises.push(isTraderFollowed(trader, wallet));
  }

  const stats: Stats[] = await Promise.all(statsPromises);
  const followed: boolean[] = await Promise.all(followedPromises);

  for (let i = 0; i < tradersAddr.length; i++) {
    traderList.push({
      avatar: Avatar,
      name: tradersAddr[i],
      lastName: tradersAddr[i].substring(0, 5),
      win: stats[i].win,
      loss: stats[i].loss,
      pnl: Number(stats[i].totalPnl.toFixed(0)),
      size: 0,
      approve: approve,
      leverage: 0,
      status: !followed[i] ? 'followed' : 'unfollowed',
    });
  }

  return traderList.sort((a, b) => b.pnl - a.pnl);
};

const getFollowedTraderInfo = async (traders: string[], wallet: string | undefined): Promise<Trader[]> => {
  const traderList: Trader[] = [];
  const approve = await getAllowance(wallet);
  for (let trader of traders) {
    const name = trader;
    const stats: Stats = await getWinLossCount(name);
    const followed: boolean = await isTraderFollowed(trader, wallet);

    traderList.push({
      avatar: Avatar,
      name: name,
      lastName: name.substring(0, 5),
      win: stats.win,
      loss: stats.loss,
      pnl: Number(stats.totalPnl.toFixed(0)),
      size: 0,
      approve: approve,
      leverage: 0,
      status: !followed ? 'followed' : 'unfollowed',
    });
  }
  return traderList;
};

const getTradersTradesHistory = async (trader: string, period: PeriodValues): Promise<any[]> => {
  const traderHistory: TraderHistory[] = [];
  const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
  const url: string = networks[chainId].graphUrl;
  const timestamp = getTimestamp(period);
  const query: string = `
    {
        trades(where: {timestamp_gt: ${timestamp}, account: "${trader}"}) {
          indexToken
          realisedPnl
          sizeDelta
          collateralDelta
          status
          timestamp
          isLong
        }
    }`;
  const response: AxiosResponse<any, any> = await axios.post(url, { query: query });
  const trades = response.data.data.trades;

  for (let trade of trades) {
    traderHistory.push({
      date: trade.timestamp,
      collateralDelta: adjustNumber(trade.collateralDelta),
      size: adjustNumber(trade.sizeDelta),
      pnl: adjustNumber(trade.realisedPnl),
      indexToken: trade.indexToken,
      isLong: trade.isLong,
      status: trade.status == 'opened' ? 'done' : 'waiting',
    });
  }

  return trades;
};

export default {
  adjustNumber,
  getUserAccount,
  addTrader,
  removeTrader,
  getTraderList,
  getAllowance,
  getFollowedTraders,
  getFollowedTraderInfo,
  getTradersTradesHistory,
};
