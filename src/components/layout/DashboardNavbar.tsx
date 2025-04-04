import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, X, Moon, Sun, ChevronDown, User,
  Settings, LogOut, PlusCircle, Bell
} from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const DashboardNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle theme toggle
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  // Handle navigation menu
  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analytics", path: "/analytics" },
    { name: "Calendar", path: "/calendar" },
  ];

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    
    const nameParts = user.user_metadata.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-semibold text-primary">
              Arl
            </span>
          </Link>

          {/* Desktop Navigation */}
          {/* <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  window.location.pathname === link.path ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div> */}

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ButtonCustom
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 p-0"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </ButtonCustom>
            
            {/* Notifications */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ButtonCustom
                  size="sm"
                  variant="ghost"
                  className="relative w-9 p-0"
                >
                  <Bell size={18} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    3
                  </Badge>
                </ButtonCustom>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                  <h3 className="font-medium text-sm">Notifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">You have 3 unread messages</p>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 max-h-80 overflow-y-auto">
                  <div className="p-2 hover:bg-secondary rounded-md cursor-pointer">
                    <p className="text-sm font-medium">You've completed a 5 day streak! 🔥</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                  <div className="p-2 hover:bg-secondary rounded-md cursor-pointer">
                    <p className="text-sm font-medium">New habit template available</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                  <div className="p-2 hover:bg-secondary rounded-md cursor-pointer">
                    <p className="text-sm font-medium">Remember to track your habits today!</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Link to="/notifications" className="text-primary text-xs flex justify-center hover:underline">
                    View all notifications
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu> */}
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ButtonCustom variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar-placeholder.png" alt={user?.user_metadata?.full_name || "User"} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </ButtonCustom>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>New Habit</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <ButtonCustom
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 p-0"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </ButtonCustom>
            
            <ButtonCustom
              size="sm"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="w-9 p-0"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </ButtonCustom>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg py-4 px-6 z-50 animate-slide-down">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  window.location.pathname === link.path ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="py-2 mt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar-placeholder.png" alt={user?.user_metadata?.full_name || "User"} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <Link to="/profile" className="flex items-center py-2 text-sm">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
              
              <Link to="/settings" className="flex items-center py-2 text-sm">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
              
              <button 
                onClick={handleSignOut}
                className="flex items-center py-2 text-sm text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
