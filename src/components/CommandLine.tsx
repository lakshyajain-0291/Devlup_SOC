import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext';

interface CommandLineProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
}

const CommandLine: React.FC<CommandLineProps> = ({ onCommand, isProcessing }) => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { projects, setSearchQuery, setTechFilter, checkKonamiCode } = useTerminal();

  // Set up global key event listener for Konami code
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Pass the key to the Konami code checker
      checkKonamiCode(e.key);
    };
    
    // Add global event listener
    window.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [checkKonamiCode]);

  useEffect(() => {
    // Focus input on mount and when processing completes
    if (!isProcessing) {
      inputRef.current?.focus();
    }
  }, [isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() && !isProcessing) {
      // Add to command history
      setCommandHistory(prev => [...prev, input]);
      
      // Process navigation commands directly
      const parts = input.toLowerCase().trim().split(' ');
      
      // Add command to terminal history before navigation
      onCommand(input);
      
      // Handle navigation commands with simpler syntax
      // Apply command
      if (parts[0] === 'apply' || parts[0] === 'a') {
        setTimeout(() => {
          navigate('/apply');
        }, 500); // Small delay to allow terminal output to be seen before navigation
        setInput('');
        setHistoryIndex(-1);
        return;
      } 
      
      // View project command
      if ((parts[0] === 'view' || parts[0] === 'v') && parts[1]) {
        const projectId = parts[1];
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setTimeout(() => {
            navigate(`/projects/${projectId}`);
          }, 500);
          setInput('');
          setHistoryIndex(-1);
          return;
        }
      }
      
      // Direct project ID entry
      if (/^\d+$/.test(parts[0])) {
        const projectId = parts[0];
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setTimeout(() => {
            navigate(`/projects/${projectId}`);
          }, 500);
          setInput('');
          setHistoryIndex(-1);
          return;
        }
      }
      
      // Projects list command
      if (parts[0] === 'projects' || parts[0] === 'p' || parts[0] === 'ls' || 
         (parts[0] === 'list' && (!parts[1] || parts[1] === 'projects'))) {
        setTimeout(() => {
          navigate('/projects');
        }, 500);
        setInput('');
        setHistoryIndex(-1);
        return;
      }

      // Search command
      if (parts[0] === 'search' || parts[0] === 's') {
        const query = parts.slice(1).join(' ');
        if (query) {
          setSearchQuery(query);
          setTimeout(() => {
            navigate('/projects');
          }, 500);
          setInput('');
          setHistoryIndex(-1);
          return;
        }
      }
      
      // Filter command
      if (parts[0] === 'filter' || parts[0] === 'f') {
        const tech = parts.slice(1).join(' ');
        if (tech) {
          setTechFilter(tech);
          setTimeout(() => {
            navigate('/projects');
          }, 500);
          setInput('');
          setHistoryIndex(-1);
          return;
        }
      }
      
      // For other commands, we already called onCommand earlier
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isProcessing) return;
    
    // Handle up/down arrows for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      if (newIndex >= 0 && commandHistory.length > 0) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setInput('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center mt-2">
      <ChevronRight size={18} className="text-terminal-text mr-2" />
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="terminal-input flex-1"
        placeholder={isProcessing ? "Processing..." : "Type a command..."}
        disabled={isProcessing}
        autoComplete="off"
        autoFocus
      />
      <div className="terminal-cursor"></div>
    </form>
  );
};

export default CommandLine;
