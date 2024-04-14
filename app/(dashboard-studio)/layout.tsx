import { MainNav } from "@/components/main-nav";
import { UserAccountNav } from "@/components/user-account-nav";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import React from "react";
import { AI } from "@/features/studio-chat/action";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <AI>
      <div className="flex h-[100dvh] flex-col bg-gray-100">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4 py-4">
            <MainNav />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </div>
        </header>
        {children}
      </div>
    </AI>
  );
}

export default DashboardLayout;
