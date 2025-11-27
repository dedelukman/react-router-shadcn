import * as React from 'react';
import {
  IconInnerShadowTop,
} from '@tabler/icons-react';

import { NavDocuments } from '~/components/panel/layout/nav-documents';
import { NavMain } from '~/components/panel/layout/nav-main';
import { NavSecondary } from '~/components/panel/layout/nav-secondary';
import { NavUser } from '~/components/panel/layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { navigationData, type AppNavItem } from '~/data/navigation-data';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const data = navigationData.menu.sidebar;

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <a href='/'>
                <IconInnerShadowTop className='!size-5' />
                <span className='text-base font-semibold'>Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
         <NavMain items={data.main.map(mapItem)} />
        <NavDocuments items={data.documents.map(mapItem)} />
        <NavSecondary items={data.secondary.map(mapItem)} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            ...data.user,
            items: data.user.menu.map(mapItem),
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );

  function mapItem(item: AppNavItem) {
    return {
      ...item,
      title: t(item.label),
      name: t(item.label),
      url: item.href,
    };
  }
}
