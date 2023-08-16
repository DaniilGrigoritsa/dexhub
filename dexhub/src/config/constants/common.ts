export const ROUTES = {
  main: {
    path: '/',
    followedList: {
      path: '/followed-list',
    },
    traderHistory: {
      path: '/:id',
    },
    startFollowing: {
      path: 'start-following/:id',
    },
  },
} as const;
