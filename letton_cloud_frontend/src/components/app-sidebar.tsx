"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  File,
  GalleryVerticalEnd,
  Image,
  Trash,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      name: "Files",
      url: "/dashboard",
      icon: File,
    },
    {
      name: "Photos",
      url: "/dashboard/photos",
      icon: Image,
    },
    {
      name: "Trash",
      url: "/dashboard/trash",
      icon: Trash,
    },
  ],
};

import * as api from "@/api";
import useSWR from "swr";
import { User } from "@/api/dto/auth.dto";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user, isLoading } = useSWR<User>("/users/me", async () => {
    return await api.auth.getMe();
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isLoading={isLoading} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
