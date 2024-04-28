import React from "react";

export function Track({ children }: { children: React.ReactNode }) {
  return <div className="max-h-[32px] min-h-[32px]">{children}</div>;
}
