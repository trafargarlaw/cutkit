"use client";
import { useFormContext } from "react-hook-form";
import { Icons } from "../../components/icons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import SubjectTab from "./components/subject-tab";
import ScriptTab from "./components/script-tab";
import type { StepsFormData } from "@/app/(dashboard-studio)/studio/page";
import ScriptTab from "./components/script-tab";

function StudioTabs() {
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
      <TabsContent value="story"> story</TabsContent>
      <TabsContent value="hook"> hook</TabsContent>
      <TabsContent value="script">
        <ScriptTab form={stepsForm} />
      </TabsContent>
      <TabsContent value="images"> images</TabsContent>
    </Tabs>
  );
}

export default StudioTabs;
