import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { Check } from "lucide-react"

const THEME_OPTIONS = [
  { value: "default", color: "text-gray-400", label: "Default" },
  { value: "red", color: "text-red-500", label: "Red" },
  { value: "rose", color: "text-rose-500", label: "Rose" },
  { value: "orange", color: "text-orange-500", label: "Orange" },
  { value: "green", color: "text-green-600", label: "Green" },
  { value: "blue", color: "text-blue-500", label: "Blue" },
  { value: "yellow", color: "text-yellow-600", label: "Yellow" },
  { value: "violet", color: "text-violet-500", label: "Violet" }
] as const

export function ThemeToggle() {
  const { setThemeColor, themeColor } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-primary dark:bg-primary/90">
         
          <span className="sr-only">Toggle theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map(({ value, color, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setThemeColor(value)}
            className={color}
          >
            {label}
            {value === themeColor && <Check className='ml-auto size-4' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}