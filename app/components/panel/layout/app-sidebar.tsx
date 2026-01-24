import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';

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
import { useGetCurrentCompanyQuery } from '~/store/api';
import { API_BASE_URL } from '~/store/api/baseApi';
import { useAuth } from '~/lib/auth';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const data = navigationData.menu.sidebar;
  const { data: currentCompany } = useGetCurrentCompanyQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Helper function to construct full image URL
  const getFullImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  // Helper function to check if user has required permissions
  const hasPermissions = (permissions?: string[]): boolean => {
    if (!permissions || permissions.length === 0) return true;
    if (!user?.permissions) return false;
    return permissions.every(perm => user.permissions!.includes(perm));
  };

  // Filter items based on permissions
  const filteredMain = data.main.filter((item) => item.href && hasPermissions(item.permissions));
  const filteredSecondary = data.secondary.filter((item) => item.href && hasPermissions(item.permissions));
  const filteredUser = data.user.filter((item) => item.href && hasPermissions(item.permissions));

  const companyName = currentCompany?.name || 'Company';
  const companyLogo = getFullImageUrl(currentCompany?.logo || '');
  const logoInitials = (companyName || 'C').substring(0, 2).toUpperCase();

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'
            >
              <a href='/'>
                <Avatar className='h-6 w-6'>
                  <AvatarImage src={companyLogo} alt={companyName} />
                  <AvatarFallback className='text-xs'>
                    {logoInitials}
                  </AvatarFallback>
                </Avatar>
                <span className='text-base font-semibold'>{companyName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMain.map(mapItem)} />
        <NavSecondary
          items={filteredSecondary.map(mapItem)}
          className='mt-auto'
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser items={filteredUser.map(mapItem)} />
      </SidebarFooter>
    </Sidebar>
  );

  function mapItem(item: AppNavItem) {
    return {
      ...item,
      title: t(item.label),
      name: t(item.label),
      url: item.href || '',
      icon: item.icon || undefined,
    };
  }
}
