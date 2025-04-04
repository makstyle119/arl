import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { HabitProvider } from "@/context/HabitContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import NewHabit from "./pages/NewHabit";
import { ScrollProvider } from "./context/ScrollContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth?type=login" replace />;
  }
  
  return <>{children}</>;
};

// Component with AuthProvider that requires BrowserRouter
const AppWithAuth = () => (
  <AuthProvider>
    <HabitProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-habit" 
          element={
            <ProtectedRoute>
              <NewHabit />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HabitProvider>
  </AuthProvider>
);

const AppWithOutAuth = () => (
  <ScrollProvider>
    <Routes>
      <Route path="/" element={<Index />} />

      {/* Everything else uses providers */}
      <Route path="/*" element={<AppWithAuth />} />
    </Routes>
  </ScrollProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithOutAuth />
        {/* <AppWithAuth /> */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
