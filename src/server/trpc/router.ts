import { router } from './index';
import { userRouter } from './routers/user';
import { bookmarkRouter } from './routers/bookmark';
import { accountRouter } from './routers/account';
import { settingsRouter } from './routers/settings';

export const appRouter = router({
  user: userRouter,
  bookmark: bookmarkRouter,
  account: accountRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
