import React from 'react';
import { Circle, X, ArrowLeft, Maximize2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext';

interface TerminalHeaderProps {
  title: string;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setView } = useTerminal();

  const handleClose = () => {
    navigate('/');
  };

  const handleBack = () => {
    if (location.pathname !== '/') {
      navigate(-1);
    } else {
      // If already at home, switch view to terminal if in projects view
      setView('terminal');
    }
  };

  const handleMaximize = () => {
    // Toggle full screen view for current content
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Error attempting to enable full-screen mode:', err);
      });
    }
  };

  return (
    <div className="terminal-header">
      <div className="flex space-x-2 mr-4">
        <div className="group relative cursor-pointer" onClick={handleClose}>
          <Circle size={12} className="text-terminal-error" fill="#F85149" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={8} className="text-black" />
          </div>
          <span className="sr-only">Close (Go to Home)</span>
        </div>
        
        <div className="group relative cursor-pointer" onClick={handleBack}>
          <Circle size={12} className="text-terminal-warning" fill="#F0883E" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowLeft size={8} className="text-black" />
          </div>
          <span className="sr-only">Go Back</span>
        </div>
        
        <div className="group relative cursor-pointer" onClick={handleMaximize}>
          <Circle size={12} className="text-terminal-success" fill="#58A6FF" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={8} className="text-black" />
          </div>
          <span className="sr-only">Toggle Fullscreen</span>
        </div>
      </div>
      <div className="flex-1 font-bold text-center text-xs">{title}</div>
    </div>
  );
};

export default TerminalHeader;
