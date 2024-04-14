"use client";

import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { useFormContext } from "react-hook-form";

type SummaryCardProps = {
  title: string;
  description: string;
};

function SummaryCard({ title, description }: SummaryCardProps) {
  const { setValue } = useFormContext<StepsFormData>();

  return (
    <button
      className="rounded-xl bg-white p-4 text-start"
      onClick={() => setValue("subject", description)}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p>{description}</p>
    </button>
  );
}

export default SummaryCard;
