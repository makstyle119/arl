import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NewHabit from "./pages/NewHabit";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import HabitDetail from "./pages/HabitDetail";
import { Toaster } from "@/components/ui/toaster";
import { HabitProvider } from "@/context/HabitContext";
import { ScrollProvider } from "./context/ScrollContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <Route path="/habits/:id" element={<ProtectedRoute><HabitDetail /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HabitProvider>
  </AuthProvider>
);

const AppWithOutAuth = () => (
  <ScrollProvider>
    <Routes>
      <Route path="/" element={<Index />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
