import React from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Button } from './ui/button';
import { Keyboard } from 'lucide-react';

interface ShortcutProviderProps {
  children: React.ReactNode;
}

/**
 * A component that provides keyboard shortcuts to the application
 * and shows a help button in the top corner
 */
const ShortcutProvider = ({ children }: ShortcutProviderProps) => {
  const { showShortcutsHelp } = useKeyboardShortcuts();

  return (
    <>
      {children}
      
      {/* Floating help button - moved to top-right to avoid obstructing footer */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-16 right-4 bg-terminal-dim/90 text-terminal-text border-terminal-accent z-50 flex items-center gap-1 shadow-md"
        onClick={showShortcutsHelp}
      >
        <Keyboard className="h-4 w-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>
    </>
  );
};

export default ShortcutProvider;