import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, User, BarChart, Phone } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-terminal-accent' : 'text-terminal-dim hover:text-terminal-text';
  };
  
  return (
    <nav className="bg-terminal border-b border-terminal-dim px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/uploads/a04b4cd1-93e6-496f-a36f-bae3a41203d5.png" 
              alt="DevlUp Labs Logo" 
              className="h-8 w-8"
            />
            <span className="text-terminal-text font-bold text-lg hidden sm:inline">DevlUp Labs</span>
          </Link>
        </div>
        
        <div className="flex font-bold items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/" className={`${isActive('/')} transition-colors flex items-center`}>
                  <Home size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1">
                  <span>Home</span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-terminal-dim rounded">Alt+H</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/projects" className={`${isActive('/projects')} transition-colors flex items-center`}>
                  <Briefcase size={16} className="mr-1" />
                  <span>Projects</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1">
                  <span>Projects</span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-terminal-dim rounded">Alt+P</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/apply" className={`${isActive('/apply')} transition-colors flex items-center`}>
                  <User size={16} className="mr-1" />
                  <span>Apply</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1">
                  <span>Apply</span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-terminal-dim rounded">Alt+A</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/stats" className={`${isActive('/stats')} transition-colors flex items-center`}>
                  <BarChart size={16} className="mr-1" />
                  <span>Stats</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1">
                  <span>Analytics</span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-terminal-dim rounded">Alt+S</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/contact" className={`${isActive('/contact')} transition-colors flex items-center hidden md:flex`}>
                  <Phone size={16} className="mr-1" />
                  <span>Contact</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1">
                  <span>Contact</span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-terminal-dim rounded">Alt+C</kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
