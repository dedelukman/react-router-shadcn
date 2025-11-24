import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useTheme } from './theme-provider';
import { Check, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const THEME_OPTIONS = [
  { value: 'default', color: 'text-gray-400', label: 'theme.default' },
  { value: 'red', color: 'text-red-500', label: 'theme.red' },
  { value: 'rose', color: 'text-rose-500', label: 'theme.rose' },
  { value: 'orange', color: 'text-orange-500', label: 'theme.orange' },
  { value: 'green', color: 'text-green-600', label: 'theme.green' },
  { value: 'blue', color: 'text-blue-500', label: 'theme.blue' },
  { value: 'yellow', color: 'text-yellow-600', label: 'theme.yellow' },
  { value: 'violet', color: 'text-violet-500', label: 'theme.violet' },
] as const;

export function ThemeToggle() {
  const { setThemeColor, themeColor } = useTheme();
  const { t } = useTranslation();

  const currentTheme =
    THEME_OPTIONS.find((option) => option.value === themeColor) ||
    THEME_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative bg-background hover:bg-accent'
          title={t('theme.changeColor')}
        >
          <Palette className={`h-4 w-4 ${currentTheme.color}`} />
          <span className='sr-only'>{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <div className='px-2 py-1.5 text-sm font-semibold'>
          {t('theme.color')}
        </div>
        {THEME_OPTIONS.map(({ value, color, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setThemeColor(value)}
            className={`flex items-center justify-between gap-2 ${color}`}
          >
            <div className='flex items-center gap-2'>
              <div
                className={`h-3 w-3 rounded-full ${color.replace('text-', 'bg-')}`}
              />
              <span>{t(label)}</span>
            </div>
            {value === themeColor && <Check className='ml-2 h-4 w-4' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
