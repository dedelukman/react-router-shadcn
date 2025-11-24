import { ModeToggle } from './mode-toggle';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from './theme-provider';
import LanguageToggle from './language-toggle';
import { IconDotsVertical } from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';

export function SettingsDropdown() {
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent  align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
              <LanguageToggle />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ModeToggle />
          </DropdownMenuItem>
          {theme !== 'system' && (
            <DropdownMenuItem asChild>
                <ThemeToggle />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}