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

export type TraderHistory = {
  date: string;
  collateralDelta: number;
  size: number;
  pnl: number;
  indexToken: string;
  isLong: boolean;
  status: 'done' | 'canceled' | 'waiting';
};

export type Stats = {
  win: number;
  loss: number;
  totalPnl: number;
}

export type Trade = {
  account: string;
  collateral: string;
  realisedPnl: string;
  sizeDelta: string;
}
