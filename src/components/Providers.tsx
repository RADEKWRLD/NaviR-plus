'use client';

import { SessionProvider } from 'next-auth/react';
import { TRPCProvider } from "@/lib/trpc/Provider";
import { AuthProvider } from "@/context/AuthContext";
import { BookmarkProvider } from "@/context/BookmarkContext";
import { SettingsProvider } from "@/context/SettingsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCProvider>
        <SettingsProvider>
          <BookmarkProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </TRPCProvider>
    </SessionProvider>
  );
}
