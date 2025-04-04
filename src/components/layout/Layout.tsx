import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
    Home,
    Calendar,
    BarChart,
    Settings,
    LogOut,
    Plus,
    Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, signOut } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <Home className="w-5 h-5" />, disabled: false },
        { name: "Calendar", path: "/calendar", icon: <Calendar className="w-5 h-5" />, disabled: true },
        { name: "Reports", path: "/reports", icon: <BarChart className="w-5 h-5" />, disabled: true },
        { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" />, disabled: true },
    ];

    const handleLogout = async () => {
        await signOut();
    };

    // State to manage theme
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect and apply initial theme
    useEffect(() => {
        localStorage.setItem("theme", "light");
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
    }, []);

    // Toggle theme between light and dark
    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-dark-background">
            {/* Mobile header */}
            <header className="lg:hidden border-b p-4 flex items-center justify-between bg-background dark:bg-dark-header sticky top-0 z-10">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-arl-500 to-arl-600 rounded-lg p-2">
                        <span className="text-white font-bold">Arl</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <Link to="/new-habit">
                        <Button variant="outline" size="icon">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </Link>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <div className="flex flex-col gap-6 mt-8">
                                <div className="flex flex-col gap-2">
                                    {menuItems.map((item) => (
                                        <Link key={item.path} to={item.disabled ? '#' : item.path}
                                            className={`text-sm font-medium transition-colors hover:text-primary ${window.location.pathname === item.path ? "text-primary" : "text-foreground/80"
                                                }`}>
                                            <Button
                                                variant={isActive(item.path) ? "default" : "ghost"}
                                                className="w-full justify-start"
                                                disabled={item.disabled}
                                            >
                                                {item.icon}
                                                <span className="ml-2">{item.name}</span>
                                            </Button>
                                        </Link>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    className="mt-auto"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Desktop layout */}
            <div className="flex flex-1">
                {/* Sidebar for desktop */}
                <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-sidebar dark:bg-dark-sidebar p-4">
                    <Link to="/dashboard" className="flex items-center gap-2 mb-8">
                        {/* <div className="bg-gradient-to-r from-arl-500 to-arl-600 rounded-lg p-2">
                            <span className="text-white font-bold text-xl">Arl</span>
                        </div> */}
                        <div className="bg-gradient-to-r from-arl-500 to-arl-600 rounded-lg p-2">
                            <span className="text-white font-bold text-xl">Arl</span>
                        </div>
                        <span className="font-bold text-xl">Habit Tracker</span>
                    </Link>

                    <nav className="flex flex-col gap-2 flex-1">
                        {menuItems.map((item) => (
                            <Link key={item.path} to={item.disabled ? '#' : item.path}>
                                <Button
                                    variant={isActive(item.path) ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    disabled={item.disabled}
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.name}</span>
                                </Button>
                            </Link>
                        ))}

                        <Link to="/new-habit" className="mt-6">
                            <Button className="w-full">
                                <Plus className="w-5 h-5 mr-2" />
                                New Habit
                            </Button>
                        </Link>
                    </nav>

                    <Button variant="outline" className="mt-auto" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                    </Button>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
            </div>

            {/* Theme Toggle Button */}
            {/* <Button variant="outline" className="fixed bottom-4 right-4" onClick={toggleTheme}>
                {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button> */}
        </div>
    );
};

export default Layout;

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import {
//     Home,
//     Calendar,
//     BarChart,
//     Settings,
//     LogOut,
//     Plus,
//     Menu,
// } from "lucide-react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// interface LayoutProps {
//     children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//     // const { user, logout } = useAuth();
//     const { user, signOut } = useAuth();
//     const location = useLocation();

//     const isActive = (path: string) => {
//         return location.pathname === path;
//     };

//     const menuItems = [
//         { name: "Dashboard", path: "/", icon: <Home className="w-5 h-5" /> },
//         {
//             name: "Calendar",
//             path: "/calendar",
//             icon: <Calendar className="w-5 h-5" />,
//         },
//         {
//             name: "Reports",
//             path: "/reports",
//             icon: <BarChart className="w-5 h-5" />,
//         },
//         {
//             name: "Settings",
//             path: "/settings",
//             icon: <Settings className="w-5 h-5" />,
//         },
//     ];

//     const handleLogout = async () => {
//         await signOut();
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-background">
//             {/* Mobile header */}
//             <header className="lg:hidden border-b p-4 flex items-center justify-between bg-background sticky top-0 z-10">
//                 <Link to="/" className="flex items-center gap-2">
//                     <div className="bg-gradient-to-r from-arl-500 to-arl-600 rounded-lg p-2">
//                         <span className="text-white font-bold">Arl</span>
//                     </div>
//                 </Link>

//                 <div className="flex items-center gap-2">
//                     <Link to="/new-habit">
//                         <Button variant="outline" size="icon">
//                             <Plus className="w-5 h-5" />
//                         </Button>
//                     </Link>

//                     <Sheet>
//                         <SheetTrigger asChild>
//                             <Button variant="outline" size="icon">
//                                 <Menu className="w-5 h-5" />
//                             </Button>
//                         </SheetTrigger>
//                         <SheetContent>
//                             <div className="flex flex-col gap-6 mt-8">
//                                 <div className="flex flex-col gap-2">
//                                     {menuItems.map((item) => (
//                                         <Link key={item.path} to={item.path}>
//                                             <Button
//                                                 variant={isActive(item.path) ? "default" : "ghost"}
//                                                 className="w-full justify-start"
//                                             >
//                                                 {item.icon}
//                                                 <span className="ml-2">{item.name}</span>
//                                             </Button>
//                                         </Link>
//                                     ))}
//                                 </div>

//                                 <Button
//                                     variant="outline"
//                                     className="mt-auto"
//                                     onClick={handleLogout}
//                                 >
//                                     <LogOut className="w-5 h-5 mr-2" />
//                                     Logout
//                                 </Button>
//                             </div>
//                         </SheetContent>
//                     </Sheet>
//                 </div>
//             </header>

//             {/* Desktop layout */}
//             <div className="flex flex-1">
//                 {/* Sidebar for desktop */}
//                 <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-sidebar p-4">
//                     <Link to="/" className="flex items-center gap-2 mb-8">
//                         <div className="bg-gradient-to-r from-arl-500 to-arl-600 rounded-lg p-2">
//                             <span className="text-white font-bold text-xl">Arl</span>
//                         </div>
//                         <span className="font-bold text-xl">Habit Tracker</span>
//                     </Link>

//                     <nav className="flex flex-col gap-2 flex-1">
//                         {menuItems.map((item) => (
//                             <Link key={item.path} to={item.path}>
//                                 <Button
//                                     variant={isActive(item.path) ? "default" : "ghost"}
//                                     className="w-full justify-start"
//                                 >
//                                     {item.icon}
//                                     <span className="ml-2">{item.name}</span>
//                                 </Button>
//                             </Link>
//                         ))}

//                         <Link to="/new-habit" className="mt-6">
//                             <Button className="w-full">
//                                 <Plus className="w-5 h-5 mr-2" />
//                                 New Habit
//                             </Button>
//                         </Link>
//                     </nav>

//                     <Button variant="outline" className="mt-auto" onClick={handleLogout}>
//                         <LogOut className="w-5 h-5 mr-2" />
//                         Logout
//                     </Button>
//                 </aside>

//                 {/* Main content */}
//                 <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
//             </div>
//         </div>
//     );
// };

// export default Layout;
