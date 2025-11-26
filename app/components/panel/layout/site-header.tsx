import { NavLink, useLocation } from 'react-router';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import NotificationsPopover from '../../toggle/notifications-popover';
import { translateTitle } from '~/i18n/translate-title';
import { SettingsDropdown } from '~/components/toggle/settings-dropdown';
import { IconSearch } from '@tabler/icons-react';
import { Button } from '~/components/ui/button';

export function SiteHeader() {
  const location = useLocation();


  const title = translateTitle(location.pathname);

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <h1 className='text-base font-medium'>{title}</h1>
        <div className='ml-auto flex items-center gap-2'>
          <NavLink to={"/app/search"}>
            {({ isActive }) => (
              <Button variant='ghost' aria-label='Search' className={isActive ? "text-primary bg-primary/5" : ` ` }>
                <IconSearch />
              </Button>
              )}
            </NavLink>
          <NotificationsPopover />
           <SettingsDropdown/>
        </div>
      </div>
    </header>
  );
}