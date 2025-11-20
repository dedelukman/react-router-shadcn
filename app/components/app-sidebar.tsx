import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "~/components/nav-documents"
import { NavMain } from "~/components/nav-main"
import { NavSecondary } from "~/components/nav-secondary"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { t } = useTranslation()

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "./avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("dashboard."),
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: t("lifecycle"),
        url: "#",
        icon: IconListDetails,
      },
      {
        title: t("analytics"),
        url: "#",
        icon: IconChartBar,
      },
      {
        title: t("projects"),
        url: "#",
        icon: IconFolder,
      },
      {
        title: t("team"),
        url: "#",
        icon: IconUsers,
      },
    ],
    navClouds: [
      {
        title: t("capture"),
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: t("activeProposals"),
            url: "#",
          },
          {
            title: t("archived"),
            url: "#",
          },
        ],
      },
      {
        title: t("proposal"),
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: t("activeProposals"),
            url: "#",
          },
          {
            title: t("archived"),
            url: "#",
          },
        ],
      },
      {
        title: t("prompts"),
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: t("activeProposals"),
            url: "#",
          },
          {
            title: t("archived"),
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: t("dashboard.settings"),
        url: "/dashboard/settings",
        icon: IconSettings,
      },
      {
        title: t("dashboard.gethelp"),
        url: "/dashboard/gethelp",
        icon: IconHelp,
      },
      {
        title: t("dashboard.search"),
        url: "/dashboard/search",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: t("dataLibrary"),
        url: "#",
        icon: IconDatabase,
      },
      {
        name: t("reports"),
        url: "#",
        icon: IconReport,
      },
      {
        name: t("wordAssistant"),
        url: "#",
        icon: IconFileWord,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
