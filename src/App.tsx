
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WasteProvider } from "./context/WasteContext";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import MunicipalDashboard from "./pages/MunicipalDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WasteProvider>
        <div className="w-full">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/municipal-dashboard" element={<MunicipalDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </WasteProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
