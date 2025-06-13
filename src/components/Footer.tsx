import React from 'react';
import { Link } from 'react-router-dom';
import { Github ,Mail } from 'lucide-react';

interface FooterProps {
  label?: string;
  showRaidLogo?: boolean;
}

const Footer: React.FC<FooterProps> = ({ label, showRaidLogo = false }) => {
  const currentYear = new Date().getFullYear();
  const footerLabel = label || `DevlUp Labs Summer of Code`;
  
  return (
    <footer className="bg-terminal border-t border-terminal-dim text-terminal-dim py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/uploads/a04b4cd1-93e6-496f-a36f-bae3a41203d5.png" 
              alt="DevlUp Labs Logo" 
              className="h-6 w-6 mr-2"
            />
            <span className="text-sm flex items-center">
              {footerLabel} &copy; {currentYear}
              {showRaidLogo && (
                <img 
                  src="/uploads/raid.png" 
                  alt="RAID Logo" 
                  className="h-6 w-6 ml-2"
                />
              )}
            </span>
          </div>
          
          <div className="flex space-x-4 items-center">
            <Link 
              to="/contact" 
              className="text-terminal-dim hover:text-terminal-text transition-colors text-sm flex items-center"
            >
              <Mail className="mr-0.5 h-4 w-4" />
              Contact Us
            </Link>
            <a 
              href="https://github.com/devlup-labs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-terminal-dim hover:text-terminal-text transition-colors text-sm flex items-center"
            >
              <Github size={16} className="mr-1" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
