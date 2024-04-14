"use client";
import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import { useFormContext } from "react-hook-form";
import { Icons } from "../../components/icons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import HookTab from "./components/hook-tab";
import StoryTab from "./components/story-tab";
import SubjectTab from "./components/subject-tab";

export function StudioTabs() {
  const { watch, setValue } = useFormContext<StepsFormData>();
  return (
    <Tabs
      value={watch("selectedTab")}
      onValueChange={(value) => setValue("selectedTab", value)}
    >
      <TabsList>
        <TabsTrigger value="subject">
          <Icons.lightBulb className="mr-2 size-4" />
          Subject
        </TabsTrigger>
        <TabsTrigger value="story" disabled={!watch("subject")}>
          <Icons.scroll className="mr-2 size-4" />
          Story
        </TabsTrigger>
        <TabsTrigger value="hook" disabled={!watch("story")}>
          <Icons.hook className="mr-2 size-4" />
          Hook
        </TabsTrigger>
        <TabsTrigger value="script" disabled={!watch("hook")}>
          <Icons.audio className="mr-2 size-4" />
          Script
        </TabsTrigger>
        <TabsTrigger value="images" disabled={!watch("script")}>
          <Icons.images className="mr-2 size-4" />
          Images
        </TabsTrigger>
      </TabsList>
      <TabsContent value="subject">
        <SubjectTab />
      </TabsContent>
      <TabsContent value="story">
        <StoryTab />
      </TabsContent>
      <TabsContent value="hook">
        <HookTab />
      </TabsContent>
      <TabsContent value="script"> script</TabsContent>
      <TabsContent value="images"> images</TabsContent>
    </Tabs>
  );
}
