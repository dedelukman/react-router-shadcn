import { Outlet } from 'react-router';
import { AppSidebar } from '~/routes/dashboard/app-sidebar';
import { SiteHeader } from '~/routes/dashboard/site-header';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import { ThemeProvider } from '../../components/theme-provider';
import { RequireAuth } from '~/lib/auth';

export default function Layout() {
  return (
    <ThemeProvider
      defaultTheme='dark'
      defaultThemeColor='default'
      storageKey='vite-ui-theme'
    >
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <main>
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
