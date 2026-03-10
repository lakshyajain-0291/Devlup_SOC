import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, User, BarChart, Phone, Calendar, Menu, X, GraduationCap} from 'lucide-react';
import { Trophy } from "lucide-react";
import { useTerminal } from '../context/TerminalContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = () => {
  const location = useLocation();
  const { projects } = useTerminal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Extract projectId from the URL path manually since useParams() doesn't work at this level
  const projectId = location.pathname.startsWith('/projects/') && location.pathname !== '/projects' 
    ? location.pathname.split('/projects/')[1] 
    : null;
  
  // Find current project if we're on a project detail page
  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;
  
  // Determine navbar text and logo based on current project category
  const getNavbarContent = () => {
    if (currentProject && currentProject.category) {
      // Check if category indicates SoC X RAID (could be '1' or text containing 'raid')
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
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-terminal-accent' : 'text-terminal-dim hover:text-terminal-text';
  };

  const navLinks = [
    { path: '/', icon: Home, label: 'Home', shortcut: 'Alt+H' },
    { path: '/mentors', icon: GraduationCap, label: 'Mentors', shortcut:'Alt+M'},
    { path: '/projects', icon: Briefcase, label: 'Projects', shortcut: 'Alt+P' },
    { path: '/apply', icon: User, label: 'Apply', shortcut: 'Alt+A' },
    { path: '/timeline', icon: Calendar, label: 'Timeline', shortcut: 'Alt+T' },
    { path: '/stats', icon: BarChart, label: 'Stats', shortcut: 'Alt+S' },
    { path: '/contact', icon: Phone, label: 'Contact', shortcut: 'Alt+C' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard', shortcut: 'Alt+L' },
  ];
  
  return (
    <>
      <nav className="bg-terminal border-b border-terminal-dim px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
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
                      <Link to={link.path} className={`${isActive(link.path)} transition-colors flex items-center`}>
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
            </TooltipProvider>
          </div>

          {/* Mobile Navigation Menu Button */}
          <div className="md:hidden">
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
        className={`md:hidden bg-terminal border-b border-terminal-dim overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen 
            ? 'max-h-96 opacity-100 translate-y-0' 
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
                  className={`${isActive(link.path)} transition-all duration-300 ease-out flex items-center space-x-2 py-3 px-4 rounded-lg hover:bg-terminal-dim/20 border border-terminal-dim/30 ${
                    mobileMenuOpen 
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
