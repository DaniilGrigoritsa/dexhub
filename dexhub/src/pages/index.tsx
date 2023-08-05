import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '#src/config';
import { FollowedList as FollowedListPage } from './followed-list';
import { Main as MainPage } from './main';
import { StartFollowing as StartFollowingPage } from './start-following';

export const Routing = () => (
  <Routes>
    <Route path={ROUTES.main.path} element={<MainPage />} />
    <Route path={ROUTES.main.startFollowing.path} element={<StartFollowingPage />} />
    <Route path={ROUTES.main.followedList.path} element={<FollowedListPage />} />
  </Routes>
);
