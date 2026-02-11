import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import ApplyPage from "./pages/ApplyPage";
import Contact from "./pages/Contact";
import Stats from "./pages/Stats";
import Timeline from "./pages/Timeline";
import { TerminalProvider } from "./context/TerminalContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ShortcutProvider from "./components/ShortcutProvider";
import SnowEffect from "./components/SnowEffect";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import Entry3D from './pages/Entry3D';


const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isEntryPage = location.pathname === "/";

  const isProjectDetailPage = location.pathname.startsWith('/projects/') && location.pathname !== '/projects';
  const { showSnow } = useTheme();

  return (
    <div className="flex flex-col min-h-screen relative">
      {showSnow && <SnowEffect />}
      {/* <div className="relative" style={{ zIndex: 10 }}> */}
       {!isEntryPage && <Navbar />}

      {/* </div> */}
      <main className="flex-grow relative" >
        <Routes>
          <Route path="/" element={<Entry3D />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/ongoing" element={<Projects />} />
          <Route path="/projects/completed" element={<Projects />} />
          <Route path="/projects/archived" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/timeline" element={<Timeline />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* Only render Footer if not on ProjectDetail page (which has its own custom Footer) */}
     {!isEntryPage && !isProjectDetailPage && (
  <div className="relative" style={{ zIndex: 10 }}>
    <Footer />
  </div>
)}

    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <TerminalProvider>
          <BrowserRouter>
            <ShortcutProvider>
              <AppContent />
              {/* Add analytics tracker to record page visits */}
              <AnalyticsTracker />
            </ShortcutProvider>
          </BrowserRouter>
        </TerminalProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
