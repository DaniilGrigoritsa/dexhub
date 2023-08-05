export const ROUTES = {
  main: {
    path: '/',
    followedList: {
      path: '/followed-list',
    },
    startFollowing: {
      path: '/:id',
    },
  },
} as const;
