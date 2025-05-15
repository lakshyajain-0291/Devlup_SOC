import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import ApplyPage from "./pages/ApplyPage";
import Contact from "./pages/Contact";
import Stats from "./pages/Stats";
import { TerminalProvider } from "./context/TerminalContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ShortcutProvider from "./components/ShortcutProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TerminalProvider>
        <BrowserRouter>
          <ShortcutProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:projectId" element={<ProjectDetail />} />
                  <Route path="/apply" element={<ApplyPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/stats" element={<Stats />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            {/* Add analytics tracker to record page visits */}
            <AnalyticsTracker />
          </ShortcutProvider>
        </BrowserRouter>
      </TerminalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
