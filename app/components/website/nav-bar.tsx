import { Menu } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useIsMobile } from '~/hooks/use-mobile';
import { getAuthMenu, navigationData } from '~/data/navigation-data';
import { useAuth } from '~/lib/auth';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../language-toggle';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const isMobile = useIsMobile();
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return null as any;
    }
  })();

  const resolvedAuth = isAuthenticated ?? Boolean(auth?.user);
  const authMenu = getAuthMenu(resolvedAuth);
  return (
    <nav className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center gap-2 hover:opacity-80 transition-opacity'
        >
          <div className='h-8 w-8 bg-primary rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold'>
              {navigationData.site.logo.text}
            </span>
            {/* Alternatif dengan gambar: */}
            {/* <img src={navigationData.site.logo.image} alt="Logo" className="h-6 w-6" /> */}
          </div>
          <span className='text-xl font-bold'>{navigationData.site.name}</span>
        </Link>

        {isMobile ? (
          <MobileNavigation authMenu={authMenu} />
        ) : (
          <DesktopNavigation authMenu={authMenu} />
        )}
      </div>
    </nav>
  );
}

interface NavigationProps {
  authMenu: readonly any[];
}

function MobileNavigation({ authMenu }: NavigationProps) {
  const { t } = useTranslation();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Menu className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-[240px] sm:w-[300px]'>
        <nav className='flex flex-col gap-4 mt-8'>
          {/* Main Menu Items */}
          {navigationData.mainMenu.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className='text-lg font-medium py-2 border-b transition-colors hover:text-primary'
            >
              {t(item.label)}
            </Link>
          ))}

          {/* Auth Menu Items */}
          <div className='flex flex-col gap-2 mt-4 pt-4 border-t'>
            {authMenu.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant={item.variant} className='w-full'>
                  {t(item.label)}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DesktopNavigation({ authMenu }: NavigationProps) {
  const { t } = useTranslation();
  return (
    <div className='flex items-center gap-6'>
      {/* Main Menu Items */}
      {navigationData.mainMenu.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className='text-sm font-medium transition-colors hover:text-primary'
        >
          {t(item.label)}
        </Link>
      ))}

      {/* Auth Menu Items */}
      <div className='flex items-center gap-4 ml-6'>
        {authMenu.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button variant={item.variant}> {t(item.label)}</Button>
          </Link>
        ))}
        <LanguageToggle />
      </div>
    </div>
  );
}
