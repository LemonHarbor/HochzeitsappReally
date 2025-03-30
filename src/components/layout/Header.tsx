import React from "react";
import { Menu, Bell, Search, Wifi, WifiOff } from "lucide-react";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { LanguageSwitcher } from "../../../../src/components/ui/language-switcher";
import { ThemeToggle } from "../../../../src/components/ui/theme-toggle";
import { CurrencySwitcher } from "../../../../src/components/ui/currency-switcher";
import { RealtimeIndicator } from "../../../../src/components/ui/realtime-indicator";
import { DeveloperToggle } from "../../../../src/components/ui/developer-toggle";
import { useAuth } from "../../../../src/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../src/components/ui/avatar";
import { SyncStatus } from "../../../../src/components/ui/sync-status";
import { Badge } from "../../../../src/components/ui/badge";
import { useLanguage } from "../../../../src/lib/language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../src/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background safe-area-padding">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={language === "de" ? "Suchen..." : "Search..."}
              className="pl-8 w-[200px] lg:w-[300px]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Network status indicator */}
          <Badge
            variant={isOnline ? "outline" : "destructive"}
            className="hidden md:flex items-center gap-1"
          >
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3" />
                <span className="text-xs">
                  {language === "de" ? "Online" : "Online"}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span className="text-xs">
                  {language === "de" ? "Offline" : "Offline"}
                </span>
              </>
            )}
          </Badge>

          <SyncStatus className="hidden md:flex" />
          <RealtimeIndicator />
          <LanguageSwitcher />
          <CurrencySwitcher />
          <ThemeToggle />
          <DeveloperToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback>
                    {user?.name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {language === "de" ? "Mein Konto" : "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => (window.location.href = "/settings")}
              >
                {language === "de" ? "Einstellungen" : "Settings"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                {language === "de" ? "Abmelden" : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
