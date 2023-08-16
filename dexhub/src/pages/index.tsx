import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '#src/config';
import { FollowedList as FollowedListPage } from './followed-list';
import { Main as MainPage } from './main';
import { StartFollowing as StartFollowingPage } from './start-following';
import { PropsWithChildren } from 'react';
import { Trader } from '#src/types';
import { TraderHistory as TraderHistoryPage } from './trader-history';

type RouterProps = PropsWithChildren<{ trader: Trader | null; setTrader: (trader: Trader) => void }>;

export const Routing = (props: RouterProps) => (
  <Routes>
    <Route path={ROUTES.main.path} element={<MainPage trader={props.trader} setTrader={props.setTrader}/>} />
    {!!props.trader && <Route path={ROUTES.main.startFollowing.path} element={<StartFollowingPage {...props.trader}/>} /> }
    <Route path={ROUTES.main.followedList.path} element={<FollowedListPage />} />
    {!!props.trader && <Route path={ROUTES.main.traderHistory.path} element={<TraderHistoryPage {...props.trader} />} /> }
  </Routes>
);
