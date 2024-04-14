import { Icons } from "@/components/icons";
import { UserAuthForm } from "@/components/user-auth-form";
import Link from "next/link";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center  lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Link
              href="/"
              className="items-center space-x-2 rounded-lg bg-secondary p-2"
            >
              <Icons.logo className=" size-5" />
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <Suspense>
            <UserAuthForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
