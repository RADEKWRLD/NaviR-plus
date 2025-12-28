import { router } from './index';
import { userRouter } from './routers/user';
import { bookmarkRouter } from './routers/bookmark';

export const appRouter = router({
  user: userRouter,
  bookmark: bookmarkRouter,
});

export type AppRouter = typeof appRouter;
