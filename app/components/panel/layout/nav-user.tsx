import {
  IconDotsVertical,
  IconLogout,
  type Icon,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '~/lib/auth';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import { useTranslation } from 'react-i18next';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    items: { title: string; url: string, icon: Icon }[];
  };
}) {
  const { isMobile } = useSidebar();
  const auth = useAuth();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const location = useLocation();
  
  // Cek apakah salah satu item user aktif berdasarkan URL saat ini
  const isActive = user.items.some(item => location.pathname === item.url);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                isActive ? 'text-primary bg-primary/5' : ''
              }`}
            >
              <Avatar className='h-8 w-8 rounded-lg grayscale'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.items.map((item) => (
                <DropdownMenuItem 
                  key={item.title}
                  className={location.pathname === item.url ? "text-primary bg-primary/5" : ""}
                  onClick={() => {
                    if (item.url !== "#") {
                      navigate(item.url);
                    }
                  }}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                auth.logout();
                navigate('/login');
              }}
            >
              <IconLogout />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}