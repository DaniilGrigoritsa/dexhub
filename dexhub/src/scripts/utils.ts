import Web3 from "web3";
import axios from "axios";
import { networks } from "./networks";
import BigNumber from 'bignumber.js';
import Manager from "#src/interfaces/Manager.json";
import Ierc20 from "#src/interfaces/Ierc20.json";
import { AbiItem } from 'web3-utils';
import { zeroAddress } from "viem";
import database from "./database";
import { AxiosResponse } from "axios";
import { Trader } from "#src/types";
import { Stats } from '#src/types';
// import { Trade } from "#src/types";
import Avatar from '#src/assets/images/avatar.png';

const web3: Web3 = new Web3(window.ethereum);
window.ethereum.enable();

const getUserAccount = async (user: string | undefined) => {
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    if (user) {
        const manager = new web3.eth.Contract(
            Manager as AbiItem[],
            networks[chainId].manager
        );
        return await manager.methods.userAccounts(user).call();
    }
    else return zeroAddress;
}

const addTrader = (trader: string, wallet: string | undefined) => {
    let chain: string = "";
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    if (chainId == "42161") chain = "arbitrum";
    else if (chainId == "43114") chain = "avalanche";
    if (!/^[a-fA-F0-9x]+$/.test(trader) || trader.length != 42) {
      console.log("Invalid trader address");
    }
    else database.addTrackedTraders(wallet, [trader], chain);
}

const removeTrader = (trader: string, wallet: string | undefined) => {
    let chain: string = "";
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    if (chainId == "42161") chain = "arbitrum";
    else if (chainId == "43114") chain = "avalanche";
    database.deleteTrackedTraders(wallet, [trader], chain);
}

const getFollowedTraders = async (wallet: string | undefined): Promise<string[]> => {
    let chain: string = "";
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    if (chainId == "42161") chain = "arbitrum";
    else if (chainId == "43114") chain = "avalanche";
    if (wallet) return await database.getTrackedTraders(wallet, chain);
    else return [];
}

const getAllowance = async (trader: string | undefined): Promise<number> => {
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    const collateral = new web3.eth.Contract(
        Ierc20 as AbiItem[],
        networks[chainId].usdc
    );
    const allowance: number = await collateral.methods.allowance(
        trader,
        networks[chainId].manager
    ).call();
    const decimals: number = await collateral.methods.decimals().call();
    const derivative = allowance / (10 ** decimals);
    return parseFloat(derivative.toFixed(2));
}

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

    let winCount = 0;
    let lossCount = 0;

    trades.map((trade: any) => {
        Number(trade.realisedPnl) > 0 ? winCount += 1 : lossCount += 1;
    })

    const stats = {
        win: winCount,
        loss: lossCount
    }

    return stats;
}

const isTraderFollowed = async (trader: string, wallet: string | undefined): Promise<boolean> => {
    let chain: string = "";
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    if (chainId == "42161") chain = "arbitrum";
    else if (chainId == "43114") chain = "avalanche";
    const users = await database.getUsersByTrader(trader, chain);
    return users[0].includes(wallet);
}

const getTraderList = async (wallet: string | undefined): Promise<Trader[]> => {
    const quantity: number = 100;
    const traderList: Trader[] = [];
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    const url: string = networks[chainId].graphUrl;
    const query: string = `
    {
        trades(first: ${quantity}, orderBy: realisedPnl, orderDirection: desc) {
          account
          realisedPnl
          sizeDelta
          collateralDelta
        }
    }`;
    const response: AxiosResponse<any, any> = await axios.post(url, { query: query });
    const trades = response.data.data.trades;
    const approve = await getAllowance(wallet);
    
    const tradersAddr: string[] = [];
    const traders = [];
    let count = 0;
    while (traders.length < 10) {
        if (!tradersAddr.includes(trades[count].account)) {
            traders.push(trades[count]);
            tradersAddr.push(trades[count].account)
        }
        count += 1;
    }

    for (let trade of traders) {
        const stats: Stats = await getWinLossCount(trade.account);
        const followed: boolean = await isTraderFollowed(trade.account, wallet);
        const name = trade.account;
        const pnl = Number(BigNumber(trade.realisedPnl).div(BigNumber(10).pow(BigNumber(30))));
        const size = Number(BigNumber(trade.sizeDelta).div(BigNumber(10).pow(BigNumber(30))));
        
        traderList.push({
            avatar: Avatar,
            name: name,
            lastName: name.substring(0, 5),
            win: stats.win,
            loss: stats.loss,
            pnl: Number(pnl.toFixed(0)),
            size: Number(size.toFixed(0)),
            approve: approve,
            leverage: Number((trade.sizeDelta / trade.collateralDelta).toFixed(0)),
            status: !followed ? "followed" : "unfollowed"
        });
    }
    
    return traderList;
}

const getFollowedTraderInfo = async (traders: string[], wallet: string | undefined): Promise<Trader[]> => {
    const traderList: Trader[] = [];
    const chainId = web3.utils.hexToNumber(window.ethereum.chainId);
    const url: string = networks[chainId].graphUrl;
    const approve = await getAllowance(wallet);
    for(let trader of traders) {
        const query = `
        {
            trades(where: {account: "${trader}"}) {
              account
              collateral
              sizeDelta
              realisedPnl
            }
        }
        `
        const response: AxiosResponse<any, any> = await axios.post(url, { query: query });
        const trades = response.data.data.trades;

        if (trades.length > 0) {
            for(let trade of trades) {
                const stats: Stats = await getWinLossCount(trade.account);
                const name = trade.account;
                const pnl = Number(BigNumber(trade.realisedPnl).div(BigNumber(10).pow(BigNumber(30))));
                const size = Number(BigNumber(trade.sizeDelta).div(BigNumber(10).pow(BigNumber(30))));

                traderList.push({
                    avatar: Avatar,
                    name: name,
                    lastName: name.substring(0, 5),
                    win: stats.win,
                    loss: stats.loss,
                    pnl: Number(pnl.toFixed(0)),
                    size: Number(size.toFixed(0)),
                    approve: approve,
                    leverage: Number((trade.sizeDelta / trade.collateral).toFixed(0)),
                    status: "unfollowed"
                });
            }
        }
        else {
            traderList.push({
                avatar: Avatar,
                name: trader,
                lastName: trader.substring(0, 5),
                win: 0,
                loss: 0,
                pnl: 0,
                size: 0,
                approve: approve,
                leverage: 0,
                status: "unfollowed"
            });
        }
        
    }
    return traderList;
}

export default { 
    getUserAccount, 
    addTrader, 
    removeTrader,
    getTraderList,
    getAllowance,
    getFollowedTraders,
    getFollowedTraderInfo
}