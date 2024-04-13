import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function StudioPage() {
  return (
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
          <Tabs>
            <TabsList>
              <TabsTrigger value="subject">
                <Icons.lightBulb className="mr-2 size-4" />
                Subject
              </TabsTrigger>
              <TabsTrigger value="story">
                <Icons.scroll className="mr-2 size-4" />
                Story
              </TabsTrigger>
              <TabsTrigger value="hook">
                <Icons.hook className="mr-2 size-4" />
                Hook
              </TabsTrigger>
              <TabsTrigger value="script">
                <Icons.audio className="mr-2 size-4" />
                Script
              </TabsTrigger>
              <TabsTrigger value="images">
                <Icons.images className="mr-2 size-4" />
                Images
              </TabsTrigger>
            </TabsList>
            <TabsContent
              className="rounded-xl bg-secondary p-4 text-secondary-foreground/70"
              value="subject"
            >
              <h1 className="font-semibold">What&apos;s your video about?</h1>
              <Textarea
                className="mt-4 rounded-xl border-white/40 bg-transparent"
                placeholder="describe what's your video about. You can discuss the subject with AI to have the best formulation of it."
              />
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline">
                  Save
                </Button>
                <Button size="sm" variant="default">
                  Confirm
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="story"> story</TabsContent>
            <TabsContent value="hook"> hook</TabsContent>
            <TabsContent value="script"> script</TabsContent>
            <TabsContent value="images"> images</TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="rounded-xl bg-white p-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem,
        ipsa.
      </div>
    </main>
  );
}

export default StudioPage;
