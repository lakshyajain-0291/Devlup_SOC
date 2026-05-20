import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Mentors from "./pages/Mentors";
import Leaderboard from "./pages/Leaderboard";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import ApplyPage from "./pages/ApplyPage";
import Contact from "./pages/Contact";
import Stats from "./pages/Stats";
import Timeline from "./pages/Timeline";
import Results from "./pages/Results";
import AdminPanel from "./pages/AdminPanel";
import MentorPanel from "./pages/MentorPanel";
import { TerminalProvider } from "./context/TerminalContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ShortcutProvider from "./components/ShortcutProvider";
import SnowEffect from "./components/SnowEffect";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import Entry3D from "./pages/Entry3D";
import EntryLoader from "./pages/EntryLoader";
import LoginModal from "./components/LoginModal";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionExpiredPopup from "./components/SessionExpiredPopup";
import {
  LAST_CONTENT_ROUTE_KEY,
  MONITOR_EMBED_QUERY_KEY,
  MONITOR_EMBED_QUERY_VALUE,
  PRESERVE_LAST_CONTENT_ROUTE_STATE,
} from "./constants/navigation";
import FormPage from './pages/form';
import ApplyFormPage from './pages/ApplyFormPage';
import LeavesEffect from "./components/LeavesEffect";

const queryClient = new QueryClient();
const WEBSITE_BACK_EXIT_STATE = "__devlupWebsiteBackExitState";
const WEBSITE_BACK_TRAP_STATE = "__devlupWebsiteBackTrapState";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEntryPage = location.pathname === "/" || location.pathname === "/entry";
  const isMonitorEmbed =
    new URLSearchParams(location.search).get(MONITOR_EMBED_QUERY_KEY) === MONITOR_EMBED_QUERY_VALUE;
  const isProjectDetailPage =
  location.pathname.startsWith("/projects/") &&
  location.pathname !== "/projects";

  const { showSnow } = useTheme();
  const { showLeaves } = useTheme();

  useEffect(() => {
    if (isEntryPage || isMonitorEmbed) return;

    if (
      location.pathname === "/home" &&
      location.state &&
      typeof location.state === "object" &&
      PRESERVE_LAST_CONTENT_ROUTE_STATE in location.state &&
      location.state[PRESERVE_LAST_CONTENT_ROUTE_STATE]
    ) {
      return;
    }

    const route = `${location.pathname}${location.search}${location.hash}`;
    window.sessionStorage.setItem(LAST_CONTENT_ROUTE_KEY, route);
  }, [isEntryPage, isMonitorEmbed, location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (isEntryPage || isMonitorEmbed) return;

    const route = `${location.pathname}${location.search}${location.hash}`;
    const historyState = window.history.state ?? {};

    if (!historyState[WEBSITE_BACK_TRAP_STATE]) {
      window.history.replaceState(
        {
          ...historyState,
          [WEBSITE_BACK_EXIT_STATE]: true,
        },
        "",
        route,
      );

      window.history.pushState(
        {
          [WEBSITE_BACK_TRAP_STATE]: true,
        },
        "",
        route,
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      if (!event.state?.[WEBSITE_BACK_EXIT_STATE]) return;
      navigate("/entry", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isEntryPage, isMonitorEmbed, location.hash, location.pathname, location.search, navigate]);

  return (
  <div className="flex flex-col min-h-screen relative overflow-hidden">
    
    {/* Background Effects */}
    {!isMonitorEmbed && (
      <>
        {showSnow && <SnowEffect />}
        {showLeaves && <LeavesEffect />}
      </>
    )}

    {/* Navbar */}
    {!isEntryPage && (
      <div className="relative z-20">
        <Navbar />
      </div>
    )}

    {/* Main Content */}
    <main className="flex-grow relative z-10">
      <Routes>
        <Route path="/" element={<EntryLoader />} />
        <Route path="/entry" element={<Entry3D />} />
        <Route path="/home" element={<Home />} />
        <Route path="/terminal" element={<Index />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/ongoing" element={<Projects />} />
        <Route path="/projects/completed" element={<Projects />} />
        <Route path="/projects/archived" element={<Projects />} />
        {/* <Route path="/projects/issues" element={<Projects />} /> */}
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/mentors" element={<Mentors />} />
        {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor"
          element={
            <ProtectedRoute>
              <MentorPanel />
            </ProtectedRoute>
          }
        />

        <Route path="/apply" element={<ApplyFormPage />} />
        <Route path="/apply/:projectId" element={<ApplyFormPage />} />
        <Route path="/apply/form" element={<FormPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/results" element={<Results />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>

    {/* Footer */}
    {!isEntryPage && !isProjectDetailPage && (
      <div className="relative z-20">
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
        <AuthProvider>
          <TerminalProvider>
            <BrowserRouter>
              <ShortcutProvider>
                <AppContent />
                <LoginModal />
                <SessionExpiredPopup />
                {/* Add analytics tracker to record page visits */}
                <AnalyticsTracker />
              </ShortcutProvider>
            </BrowserRouter>
          </TerminalProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
