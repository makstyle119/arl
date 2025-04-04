import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useScroll } from "@/context/ScrollContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const { scrollTo } = useScroll();

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
    { name: "Home", path: "/", section: 'hero' },
    { name: "Features", path: "/#features", section: 'features' },
    { name: "Pricing", path: "/#pricing", section: 'pricing' },
  ];

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold text-primary">
              Arl
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? "text-primary" : "text-foreground/80"
                }`}
                onClick={() => scrollTo(link.section)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <ButtonCustom
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 p-0"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </ButtonCustom> */}
            
            {location.pathname !== "/auth" && (
              <>
                <ButtonCustom size="sm" variant="outline" asChild>
                  <Link to="/auth?type=login">Sign in</Link>
                </ButtonCustom>
                <ButtonCustom size="sm" gradient asChild>
                  <Link to="/auth?type=register">Get Started</Link>
                </ButtonCustom>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* <ButtonCustom
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 p-0"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </ButtonCustom> */}
            
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
                  location.pathname === link.path ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {location.pathname !== "/auth" && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <ButtonCustom size="sm" variant="outline" asChild className="w-full justify-center">
                  <Link to="/auth?type=login">Sign in</Link>
                </ButtonCustom>
                <ButtonCustom size="sm" gradient asChild className="w-full justify-center">
                  <Link to="/auth?type=register">Get Started</Link>
                </ButtonCustom>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
