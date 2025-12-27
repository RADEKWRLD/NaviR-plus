'use client';

import { SessionProvider } from 'next-auth/react';
import { TRPCProvider } from "@/lib/trpc/Provider";
import { AuthProvider } from "@/context/AuthContext";
import { BookmarkProvider } from "@/context/BookmarkContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCProvider>
        <BookmarkProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </BookmarkProvider>
      </TRPCProvider>
    </SessionProvider>
  );
}
