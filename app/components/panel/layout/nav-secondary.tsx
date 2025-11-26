"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { NavLink } from "react-router"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <NavLink to={item.url} key={item.title}>
               {({ isActive }) => (
            <SidebarMenuItem >
              <SidebarMenuButton className={ item.url === "#" ? "" : isActive ? "text-primary bg-primary/5" : ` ` }>
                  <item.icon />
                  <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
               )}
            </NavLink>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
