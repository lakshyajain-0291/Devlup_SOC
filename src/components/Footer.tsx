import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
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
            <span className="text-sm">DevlUp Labs Summer of Code &copy; {currentYear}</span>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/contact" className="text-terminal-dim hover:text-terminal-text transition-colors text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
