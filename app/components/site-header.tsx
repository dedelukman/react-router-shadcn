
import { useLocation } from "react-router"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "./theme-provider";


export function SiteHeader() {

  const location = useLocation();
const pathname: string = location.pathname;
const segments: string[] = pathname.split("/").filter(Boolean);
const lastSegment: string = segments.length ? segments[segments.length - 1] : "home";
const title: string = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  const {theme} = useTheme()


  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {theme !== "system" && <ThemeToggle />}

          
        </div>
      </div>
    </header>
  )
}
