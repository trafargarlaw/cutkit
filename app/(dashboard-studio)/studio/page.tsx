"use client";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StudioChat from "@/features/studio-chat/studio-chat";
import StudioTabs from "@/features/studio-tabs/studio-tabs";
import { stepsValidationSchema } from "@/lib/validation/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm, FormProvider } from "react-hook-form";
import type { z } from "zod";

export type StepsFormData = z.infer<typeof stepsValidationSchema>;
export type StepsFormType = UseFormReturn<FormData>;

function StudioPage() {
  const methods = useForm<StepsFormData>({
    resolver: zodResolver(stepsValidationSchema),
    defaultValues: {
      selectedTab: "subject",
    },
  });
  return (
    <FormProvider {...methods}>
      <main className="grid h-full grid-cols-2 gap-4 p-4">
        <div className="rounded-xl bg-white p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Icons.squarePlay className="size-8 text-primary" />
            <div>Untitled</div>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full bg-gray-100 p-1.5">
                <Icons.ellipsis className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  Delete draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4">
            <StudioTabs />
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <StudioChat />
        </div>
      </main>
    </FormProvider>
  );
}

export default StudioPage;
