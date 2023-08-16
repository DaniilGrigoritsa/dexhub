import Avatar from '#src/assets/images/avatar.png';
import type { Trader } from '#src/types';

const randomFn = () => Math.floor(Math.random() * 90 + 10);

export const Tokens = {
  43114: {
    
  },
  42161: {

  }
}

export const TRADER_LIST: Trader[] = Array(20)
  .fill(1)
  .map((_, index) => ({
    name: '0xa78d',
    lastName: `${randomFn()}a${index}`,
    win: 3,
    loss: 5,
    size: randomFn() * (index + 1) * 10000,
    pnl: randomFn() * (index + 1) * 100 * (Math.random() < 0.5 ? -1 : 1),
    avatar: Avatar,
    approve: 55.87,
    leverage: 8,
    status: Math.random() < 0.5 ? 'followed' : 'unfollowed',
  }));

  /*
export const HISTORY_LIST: TraderHistory[] = Array(20)
  .fill(1)
  .map((_, index) => ({
    date: new Date(2023, 7, 12).toISOString(),
    entry: 11245,
    size: randomFn() * (index + 1) * 10000,
    pnl: randomFn() * (index + 1) * 100 * (Math.random() < 0.5 ? -1 : 1),
    status: Math.random() < 0.5 ? 'done' : Math.random() < 0.5 ? 'waiting' : 'canceled',
  }));
*/