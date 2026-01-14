import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { NavLink } from "react-router"

import { Button } from "~/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items.map((item) => (
            <NavLink to={item.url} key={item.title} >
           {({ isActive }) => (
            <SidebarMenuItem >
              <SidebarMenuButton tooltip={item.title}  className={ item.url === "#" ? "" : isActive ? "text-primary bg-primary/5" : ` ` }>
                {item.icon && <item.icon />}
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
