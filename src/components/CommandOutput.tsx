
import React from 'react';

export interface CommandResponse {
  type: 'command' | 'response' | 'error' | 'project' | 'mentor' | 'form' | 'help' | 'success';
  content: React.ReactNode;
}

interface CommandOutputProps {
  output: CommandResponse[];
}

const CommandOutput: React.FC<CommandOutputProps> = ({ output }) => {
  const getOutputClass = (type: CommandResponse['type']) => {
    switch (type) {
      case 'command':
        return 'text-terminal-text font-semibold';
      case 'response':
        return 'text-terminal-dim';
      case 'error':
        return 'text-terminal-error';
      case 'project':
        return 'text-terminal-success';
      case 'mentor':
        return 'text-terminal-accent';
      case 'form':
        return 'text-terminal-warning';
      case 'help':
        return 'text-terminal-accent';
      case 'success':
        return 'text-terminal-success';
      default:
        return 'text-terminal-text';
    }
  };

  return (
    <div className="command-output space-y-2 mb-4">
      {output.map((item, index) => (
        <div key={index} className={`${getOutputClass(item.type)} whitespace-pre-wrap`}>
          {item.type === 'command' && <span className="mr-2">{">"}</span>}
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default CommandOutput;
