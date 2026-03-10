import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from './use-toast';

interface ShortcutRoute {
  key: string;
  route: string;
  description: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  focusTerminal?: boolean;
}

/**
 * Custom hook for keyboard navigation shortcuts
 * 
 * Registers keyboard shortcuts for quick navigation between routes
 * Displays toast notifications when shortcuts are activated
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const shortcutsToastIdRef = useRef<string | null>(null);
  const shortcutsDismissRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Define the navigation shortcuts
    const shortcuts: ShortcutRoute[] = [
      { key: 'h', route: '/', description: 'Home', altKey: true, focusTerminal: false },
      { key: 'p', route: '/projects', description: 'Projects', altKey: true },
      { key: 'a', route: '/apply', description: 'Apply', altKey: true },
      { key: 't', route: '/timeline', description: 'Timeline', altKey: true },
      { key: 's', route: '/stats', description: 'Stats', altKey: true },
      { key: 'c', route: '/contact', description: 'Contact', altKey: true },
      { key: 'm', route: '/mentors', description: 'Mentors', altKey: true },
      { key: 't', route: '/', description: 'Terminal View', altKey: true, shiftKey: true, focusTerminal: true },
      { key: '/', route: '/', description: 'Help', altKey: true, shiftKey: true },
      { key: 'l', route: '/leaderboard', description: 'Leaderboard', altKey: true },
    ];

    // Handle keyboard events
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields, textareas, etc.
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Find the matching shortcut
      // Sort shortcuts to check more specific ones (with shiftKey/ctrlKey) first
      const sortedShortcuts = [...shortcuts].sort((a, b) => {
        // Prioritize shortcuts with shiftKey or ctrlKey defined
        const aSpecificity = (a.shiftKey !== undefined ? 1 : 0) + (a.ctrlKey !== undefined ? 1 : 0);
        const bSpecificity = (b.shiftKey !== undefined ? 1 : 0) + (b.ctrlKey !== undefined ? 1 : 0);
        return bSpecificity - aSpecificity;
      });

      const shortcut = sortedShortcuts.find(
        (s) =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          s.altKey === event.altKey &&
          (s.ctrlKey === undefined ? !event.ctrlKey : s.ctrlKey === event.ctrlKey) &&
          (s.shiftKey === undefined ? !event.shiftKey : s.shiftKey === event.shiftKey)
      );

      if (shortcut) {
        event.preventDefault();
        navigate(shortcut.route);
        
        // If this shortcut should focus the terminal, do so after navigation
        if (shortcut.focusTerminal) {
          // Wait for navigation to complete, then focus the terminal input
          setTimeout(() => {
            const terminalInput = document.querySelector('.terminal-input') as HTMLInputElement;
            if (terminalInput) {
              terminalInput.focus();
            }
          }, 100);
        }
        
        // Show a toast notification
        toast({
          title: "Navigation",
          description: `Navigated to ${shortcut.description}`,
          duration: 2000,
        });
      }
    };

    // Add and remove the event listener
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  // Return a method to display the help toast with all shortcuts (toggleable)
  const showShortcutsHelp = () => {
    // If a shortcuts toast is already open, dismiss it
    if (shortcutsDismissRef.current) {
      shortcutsDismissRef.current();
      shortcutsDismissRef.current = null;
      shortcutsToastIdRef.current = null;
      return;
    }

    // Otherwise, show the shortcuts toast
    const toastResult = toast({
      title: "Keyboard Shortcuts",
      description: (
        <div className="space-y-1">
          <p className="font-semibold">Navigation:</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+H</kbd> - Home</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+P</kbd> - Projects</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+A</kbd> - Apply</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+T</kbd> - Timeline</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+S</kbd> - Stats</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+C</kbd> - Contact</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+M</kbd> - Mentors</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+L</kbd> - Leaderboard</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+Shift+T</kbd> - Terminal View</p>
        </div>
      ),
      duration: 5000,
      onOpenChange: (open) => {
        if (!open) {
          shortcutsToastIdRef.current = null;
          shortcutsDismissRef.current = null;
        }
      },
    });
    
    shortcutsToastIdRef.current = toastResult.id;
    shortcutsDismissRef.current = toastResult.dismiss;
  };

  return { showShortcutsHelp };
}