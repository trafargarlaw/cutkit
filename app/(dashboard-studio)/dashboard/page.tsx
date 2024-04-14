import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function DashboardPage() {
  return (
    <div>
      <Link href="/studio" className={buttonVariants()}>
        Start New Video
      </Link>
    </div>
  );
}

export default DashboardPage;
