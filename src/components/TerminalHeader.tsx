
import React from 'react';
import { Circle } from 'lucide-react';

interface TerminalHeaderProps {
  title: string;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ title }) => {
  return (
    <div className="terminal-header">
      <div className="flex space-x-2 mr-4">
        <Circle size={12} className="text-terminal-error" fill="#F85149" />
        <Circle size={12} className="text-terminal-warning" fill="#F0883E" />
        <Circle size={12} className="text-terminal-success" fill="#3FB950" />
      </div>
      <div className="flex-1 text-center text-xs">{title}</div>
    </div>
  );
};

export default TerminalHeader;
