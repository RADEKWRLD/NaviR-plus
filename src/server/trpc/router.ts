import { router } from './index';
import { userRouter } from './routers/user';
import { bookmarkRouter } from './routers/bookmark';
import { accountRouter } from './routers/account';

export const appRouter = router({
  user: userRouter,
  bookmark: bookmarkRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
