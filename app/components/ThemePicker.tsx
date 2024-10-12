import { Moon, Sun } from "lucide-react";
import { forwardRef } from "react";
import { Theme, useTheme } from "remix-themes";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const ThemePickerBase = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const [theme, setTheme, metadata] = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          {...props}
          className={className}
          ref={ref}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-black/20">
        <DropdownMenuItem
          onClick={() => setTheme(Theme.LIGHT)}
          className={`${theme === Theme.LIGHT && metadata.definedBy !== "SYSTEM" ? "bg-muted text-muted-foreground" : ""}`}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(Theme.DARK)}
          className={`${theme === Theme.DARK && metadata.definedBy !== "SYSTEM" ? "bg-muted text-muted-foreground" : ""}`}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(null)}
          className={`${metadata.definedBy === "SYSTEM" ? "bg-muted text-muted-foreground" : ""}`}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
ThemePickerBase.displayName = "ThemePickerBase";

export const ThemePicker = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ThemePickerBase {...props} ref={ref} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
ThemePicker.displayName = "ThemePicker";
