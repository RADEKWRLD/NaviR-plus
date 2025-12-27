'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, httpLink, splitLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';
import { trpc } from './client';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition: (op) => op.type === 'query',
          // Batch queries together for performance
          true: httpBatchLink({
            url: '/api/trpc',
            transformer: superjson,
            headers: () => ({
              'Content-Type': 'application/json',
            }),
          }),
          // Send mutations individually with guaranteed POST
          false: httpLink({
            url: '/api/trpc',
            transformer: superjson,
            headers: () => ({
              'Content-Type': 'application/json',
            }),
          }),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
