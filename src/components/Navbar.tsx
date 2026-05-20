import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Briefcase, User, BarChart, Phone, Calendar, Menu, X, GraduationCap, LogOut, LogIn, Award } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';
import { useAuth } from '../context/AuthContext';
import { googleLogin, fetchResultsSetting } from '../services/apiClient';
import { useToast } from '../hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PRESERVE_LAST_CONTENT_ROUTE_STATE } from "../constants/navigation";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Load the Google Identity Services script
const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('google-identity-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useTerminal();
  const { isAuthenticated, googleUser, isGoogleUser, logout, login, setGoogleUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const googleInitializedRef = useRef(false);
  const [showResultsLink, setShowResultsLink] = useState(false);

  useEffect(() => {
    const checkResults = async () => {
      try {
        const data = await fetchResultsSetting();
        setShowResultsLink(data.show_results);
      } catch (err) {
        setShowResultsLink(false);
      }
    };
    checkResults();
  }, []);

  // Extract projectId from the URL path manually since useParams() doesn't work at this level
  const projectId = location.pathname.startsWith('/projects/') && location.pathname !== '/projects'
    ? location.pathname.split('/projects/')[1]
    : null;

  // Find current project if we're on a project detail page
  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;

  // Determine navbar text and logo based on current project category
  const getNavbarContent = () => {
    if (currentProject && currentProject.category) {
      if (currentProject.category === '1' ||
        currentProject.category.toString().toLowerCase().includes('soc x raid') ||
        currentProject.category.toString().toLowerCase().includes('raid')) {
        return {
          text: 'DevlUp Labs X RAID',
          showRaidLogo: true
        };
      }
    }
    return {
      text: 'DevlUp Labs',
      showRaidLogo: false
    };
  };

  const navbarContent = getNavbarContent();

  // Initialize Google Identity Services once
  useEffect(() => {
    if (googleInitializedRef.current || !GOOGLE_CLIENT_ID) return;

    const init = async () => {
      try {
        await loadGoogleScript();
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
          });
          googleInitializedRef.current = true;
        }
      } catch (err) {
        console.error('Google Identity Services failed to load:', err);
      }
    };

    init();
  }, []);

  const handleGoogleCallback = async (response: { credential: string }) => {
    try {
      const data = await googleLogin(response.credential);
      if (data && data.access_token) {
        login(data.access_token);
        if (data.user) {
          setGoogleUser(data.user);
        }
        if (data.user?.role === 'mentor') {
          toast({
            title: "Signed In as Mentor",
            description: "You can review applications of your project.",
          });
        } else {
          toast({
            title: "Signed In",
            description: `Welcome, ${data.user?.name || 'User'}!`,
          });
        }
      } else {
        throw new Error("No access token found");
      }
    } catch (error: any) {
      let msg = "Google sign-in failed.";
      if (error.response?.data?.detail) {
        msg = error.response.data.detail;
      }
      toast({
        title: "Sign-In Failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast({
        title: "Error",
        description: "Google Sign-In is not available. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-terminal-accent' : 'text-terminal-dim hover:text-terminal-text';
  };

  const baseLinks = [
    {
      path: '/home',
      icon: Home,
      label: 'Home',
      shortcut: 'Alt+H',
      state: { [PRESERVE_LAST_CONTENT_ROUTE_STATE]: true },
    },
    { path: '/mentors', icon: GraduationCap, label: 'Mentors', shortcut: 'Alt+M' },
    { path: '/projects', icon: Briefcase, label: 'Projects', shortcut: 'Alt+P' },
    { path: '/apply', icon: User, label: 'Apply', shortcut: 'Alt+A' },
    { path: '/timeline', icon: Calendar, label: 'Timeline', shortcut: 'Alt+T' },
    { path: '/stats', icon: BarChart, label: 'Stats', shortcut: 'Alt+S' },
    { path: '/contact', icon: Phone, label: 'Contact', shortcut: 'Alt+C' },
  ];

  const navLinks = [...baseLinks];
  if (showResultsLink) {
    navLinks.splice(3, 0, { path: '/results', icon: Award, label: 'Results', shortcut: 'Alt+R' });
  }
  if (isGoogleUser && googleUser) {
    if (googleUser.role === 'mentor') {
      navLinks.push({ path: '/mentor', icon: Briefcase, label: 'Mentor Panel', shortcut: '' });
    }
  }

  return (
    <>
      <nav className="bg-black/60 backdrop-blur-md border-b border-terminal-dim px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              to="/home"
              state={{ [PRESERVE_LAST_CONTENT_ROUTE_STATE]: true }}
              className="flex items-center space-x-2"
            >
              <img
                src="/uploads/a04b4cd1-93e6-496f-a36f-bae3a41203d5.png"
                alt="DevlUp Labs Logo"
                className="h-8 w-8"
              />
              <span className="text-terminal-text font-bold text-lg hidden sm:flex items-center">
                {navbarContent.text}
                {navbarContent.showRaidLogo && (
                  <img
                    src="/uploads/raid.png"
                    alt="RAID Logo"
                    className="h-8 w-8 ml-2"
                  />
                )}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex font-bold items-center space-x-4">
            <TooltipProvider>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Tooltip key={link.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={link.path}
                        state={link.state}
                        className={`${isActive(link.path)} transition-colors flex items-center`}
                      >
                        <Icon size={16} className="mr-1" />
                        <span>{link.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex items-center gap-1">
                        <span>{link.label}</span>
                        {link.shortcut && (
                          <kbd className="px-1.5 py-0.5 text-xs bg-terminal-dim rounded">{link.shortcut}</kbd>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* Google Sign In / User Section */}
              {isGoogleUser && googleUser ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        logout();
                        toast({ title: "Signed Out", description: "You have been signed out." });
                      }}
                      className="flex items-center gap-1.5 text-terminal-dim hover:text-terminal-text transition-colors"
                    >
                      {googleUser.picture ? (
                        <img
                          src={googleUser.picture}
                          alt={googleUser.name || 'User'}
                          className="h-6 w-6 rounded-full border border-terminal-accent/50"
                        />
                      ) : (
                        <User size={16} />
                      )}
                      <LogOut size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {`Signed in as ${googleUser.name || googleUser.email} · Click to sign out`}
                    </span>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleGoogleSignIn}
                      className="flex items-center gap-1 text-terminal-dim hover:text-terminal-accent transition-colors"
                    >
                      <LogIn size={16} />
                      <span>Sign In</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Sign in with Google</span>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>

          {/* Mobile Navigation Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isGoogleUser && googleUser?.picture && (
              <img
                src={googleUser.picture}
                alt={googleUser.name || 'User'}
                className="h-7 w-7 rounded-full border border-terminal-accent/50"
              />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-terminal-text hover:text-terminal-accent transition-colors p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden bg-black/60 backdrop-blur-md border-b border-terminal-dim overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen
          ? 'max-h-[500px] opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  state={link.state}
                  className={`${isActive(link.path)} transition-all duration-300 ease-out flex items-center space-x-2 py-3 px-4 rounded-lg hover:bg-terminal-dim/20 border border-terminal-dim/30 ${mobileMenuOpen
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-2 scale-95'
                    }`}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 30}ms` : `${(navLinks.length - index) * 20}ms`
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Sign In / Sign Out */}
            {isGoogleUser && googleUser ? (
              <button
                onClick={() => {
                  logout();
                  toast({ title: "Signed Out", description: "You have been signed out." });
                  setMobileMenuOpen(false);
                }}
                className={`transition-all duration-300 ease-out flex items-center space-x-2 py-3 px-4 rounded-lg hover:bg-red-500/20 border border-terminal-dim/30 text-terminal-dim hover:text-red-400 ${mobileMenuOpen
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-95'
                  }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${navLinks.length * 30}ms` : '0ms'
                }}
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  handleGoogleSignIn();
                  setMobileMenuOpen(false);
                }}
                className={`transition-all duration-300 ease-out flex items-center space-x-2 py-3 px-4 rounded-lg hover:bg-terminal-dim/20 border border-terminal-dim/30 text-terminal-dim hover:text-terminal-accent ${mobileMenuOpen
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-95'
                  }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${navLinks.length * 30}ms` : '0ms'
                }}
              >
                <LogIn size={18} />
                <span className="font-medium text-sm">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Extend Window interface for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
}

export default Navbar;
