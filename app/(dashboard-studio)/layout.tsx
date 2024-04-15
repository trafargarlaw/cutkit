"use client";

import { MainNav } from "@/components/main-nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-[100dvh] flex-col bg-gray-100">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4 py-4">
            <MainNav />
            {/* <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          /> */}
          </div>
        </header>
        {children}
      </div>
    </QueryClientProvider>
  );
}

export default DashboardLayout;
