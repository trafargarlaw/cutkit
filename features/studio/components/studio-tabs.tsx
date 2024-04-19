"use client";
import { useFormContext } from "react-hook-form";
import { Icons } from "../../../components/icons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import type { StepsFormData } from "../studio";
import { HookTab } from "./hook-tab";
import ImagesTab from "./image-tab";
import { ScriptTab } from "./script-tab";
import { StoryTab } from "./story-tab";
import { SubjectTab } from "./subject-tab";

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
      <TabsContent value="subject">
        <SubjectTab />
      </TabsContent>
      <TabsContent value="story">
        <StoryTab />
      </TabsContent>
      <TabsContent value="hook">
        <HookTab />
      </TabsContent>
      <TabsContent value="script">
        <ScriptTab />
      </TabsContent>
      <TabsContent value="images">
        <ImagesTab />
      </TabsContent>
    </Tabs>
  );
}
