export type Trader = {
  avatar: string;
  name: string;
  lastName: string;
  win: number;
  loss: number;
  pnl: number;
  size: number;
  approve: number;
  leverage: number;
  status: 'followed' | 'unfollowed';
};

export type Stats = {
  win: number;
  loss: number;
}

export type Trade = {
  account: string;
  collateral: string;
  realisedPnl: string;
  sizeDelta: string;
}
