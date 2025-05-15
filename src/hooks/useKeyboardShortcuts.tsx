import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from './use-toast';

interface ShortcutRoute {
  key: string;
  route: string;
  description: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

/**
 * Custom hook for keyboard navigation shortcuts
 * 
 * Registers keyboard shortcuts for quick navigation between routes
 * Displays toast notifications when shortcuts are activated
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    // Define the navigation shortcuts
    const shortcuts: ShortcutRoute[] = [
      { key: 'h', route: '/', description: 'Home', altKey: true },
      { key: 'p', route: '/projects', description: 'Projects', altKey: true },
      { key: 'a', route: '/apply', description: 'Apply', altKey: true },
      { key: 's', route: '/stats', description: 'Stats', altKey: true },
      { key: 'c', route: '/contact', description: 'Contact', altKey: true },
      { key: 't', route: '/', description: 'Terminal View', altKey: true, shiftKey: true },
      { key: '/', route: '/', description: 'Help', altKey: true, shiftKey: true },
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
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          s.altKey === event.altKey &&
          (s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey) &&
          (s.shiftKey === undefined || s.shiftKey === event.shiftKey)
      );

      if (shortcut) {
        event.preventDefault();
        navigate(shortcut.route);
        
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

  // Return a method to display the help toast with all shortcuts
  const showShortcutsHelp = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: (
        <div className="space-y-1">
          <p className="font-semibold">Navigation:</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+H</kbd> - Home</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+P</kbd> - Projects</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+A</kbd> - Apply</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+S</kbd> - Stats</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+C</kbd> - Contact</p>
          <p><kbd className="px-1 bg-terminal-dim rounded">Alt+Shift+T</kbd> - Terminal View</p>
        </div>
      ),
      duration: 5000,
    });
  };

  return { showShortcutsHelp };
}