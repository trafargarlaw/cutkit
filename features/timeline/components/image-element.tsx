import { Icons } from "@/components/icons";
import type { MediaElement } from "@/lib/store";

export function ImageElement({ element }: { element: MediaElement }) {
  const Icon = Icons[element.type as keyof typeof Icons];
  return (
    <div className="relative ml-0 box-border h-[32px] w-[100px] min-w-[100px] overflow-hidden rounded-md bg-purple-400">
      <div className="h-full">
        <div className="pointer-events-none size-full">
          <div className="flex h-full w-full flex-nowrap items-center space-x-2  px-4">
            <span>
              <Icon className="size-4" />
            </span>
            <span className="truncate">{element.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
