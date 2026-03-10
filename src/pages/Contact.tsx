import React from 'react';
import { Mail, MapPin, Phone, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import TerminalHeader from '../components/TerminalHeader';

const Contact = () => {
  return (
    <div className="min-h-screen bg-terminal/95 flex flex-col items-center p-2 sm:p-4">
      <div className="terminal-window max-w-6xl w-full mx-auto my-4 sm:my-8">
        <TerminalHeader title="Contact DevlUp Labs" />
        <div className="terminal-body min-h-[500px] overflow-y-auto p-3 sm:p-6">
          {/* FAQ Section moved to top */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-terminal-text mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-medium text-terminal-accent">How do I apply for a project?</h3>
                <p className="text-xs sm:text-sm text-terminal-dim mt-1">Visit our Projects page, select a project that interests you, and click the "Apply Now" button to submit your application.</p>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-terminal-accent">What is the application deadline?</h3>
                <p className="text-xs sm:text-sm text-terminal-dim mt-1">The application deadline for the current cycle will be notified via mail but we suggest you fill the form asap.</p>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-terminal-accent">Do I need prior open source experience?</h3>
                <p className="text-xs sm:text-sm text-terminal-dim mt-1">While prior experience is helpful, it's not required. We welcome enthusiastic beginners who are willing to learn.</p>
              </div>
            </div>
          </div>
          
          {/* Get in Touch section */}
          <div className="border-t border-terminal-dim pt-4 sm:pt-6 mt-4 sm:mt-6">
            <h1 className="text-xl sm:text-2xl font-bold text-terminal-text mb-4 sm:mb-6">Get in Touch</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Contact Information */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-terminal-text mb-2 sm:mb-3">Contact Information</h2>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-terminal-dim text-sm sm:text-base">
                      <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-terminal-accent flex-shrink-0" />
                      <a href="mailto:devluplabs@iitj.ac.in" className="hover:text-terminal-text break-all">
                      devluplabs@iitj.ac.in
                      </a>
                    </div>
                                        
                    <div className="flex items-start text-terminal-dim text-sm sm:text-base">
                      <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-terminal-accent flex-shrink-0 mt-0.5" />
                      <span>
                        IIT Jodhpur
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-terminal-text mb-2 sm:mb-3">Connect With Us</h2>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-terminal-dim text-sm sm:text-base">
                      <Globe className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-terminal-accent flex-shrink-0" />
                      <a 
                        href="https://devluplabs.tech/#/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center break-all"
                      >
                        devluplabs.tech/
                        <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                    
                    <div className="flex items-center text-terminal-dim text-sm sm:text-base">
                      <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-terminal-accent flex-shrink-0" />
                      <a 
                        href="https://github.com/devlup-labs" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center break-all"
                      >
                        github.com/devlup-labs
                        <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                    
                    <div className="flex items-center text-terminal-dim text-sm sm:text-base">
                      <Linkedin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-terminal-accent flex-shrink-0" />
                      <a 
                        href="https://linkedin.com/company/devlup-labs" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center break-all"
                      >
                        linkedin.com/company/devlup-labs
                        <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-terminal-text mb-2 sm:mb-3">To Contribute</h2>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-terminal-dim text-sm sm:text-base">
                      <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-terminal-accent flex-shrink-0" />
                      <a 
                        href="https://github.com/lakshyajain-0291/Devlup_SOC" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center break-all"
                      >
                        lakshyajain-0291/Devlup_SOC
                        <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                    
                  </div>
                </div>

              </div>
              
            </div>
          </div>
          
          Map Section
          <div className="mt-8 border border-terminal-dim rounded-lg overflow-hidden h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.525761652536!2d73.11342220000002!3d26.4710115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c5ea672337b%3A0xb6c9a5a9b08db22e!2sIndian%20Institute%20of%20Technology%20(IIT)%2C%20Jodhpur!5e0!3m2!1sen!2sin!4v1769708743039!5m2!1sen!2sin&theme=dark"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PES University Electronic City Campus Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
