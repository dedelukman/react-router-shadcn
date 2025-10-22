import { Outlet } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { ThemeProvider } from "./theme-provider";

export default function Layout() {
    return (
         <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                      } as React.CSSProperties
                 }
            >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <main>
                    <Outlet />
                </main>
            </SidebarInset>
            </SidebarProvider>
         </ThemeProvider>
        )
        ;
}