import React from 'react';
import { Mail, MapPin, Phone, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import TerminalHeader from '../components/TerminalHeader';

const Contact = () => {
  return (
    <div className="min-h-screen bg-terminal flex flex-col items-center p-4">
      <div className="terminal-window max-w-4xl w-full mx-auto my-8">
        <TerminalHeader title="Contact DevlUp Labs" />
        <div className="terminal-body min-h-[500px] overflow-y-auto p-6">
          {/* FAQ Section moved to top */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-terminal-text mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-terminal-accent">How do I apply for the Summer of Code program?</h3>
                <p className="text-terminal-dim mt-1">Visit our Projects page, select a project that interests you, and click the "Apply Now" button to submit your application.</p>
              </div>
              <div>
                <h3 className="font-medium text-terminal-accent">What is the application deadline?</h3>
                <p className="text-terminal-dim mt-1">The application deadline for the current cycle will be notified via mail but we suggest you fill the form asap.</p>
              </div>
              <div>
                <h3 className="font-medium text-terminal-accent">Do I need prior open source experience?</h3>
                <p className="text-terminal-dim mt-1">While prior experience is helpful, it's not required. We welcome enthusiastic beginners who are willing to learn.</p>
              </div>
            </div>
          </div>
          
          {/* Get in Touch section */}
          <div className="border-t border-terminal-dim pt-6 mt-6">
            <h1 className="text-2xl font-bold text-terminal-text mb-6">Get in Touch</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-terminal-text mb-3">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-terminal-dim">
                      <Mail className="mr-2 h-5 w-5 text-terminal-accent" />
                      <a href="mailto:devluplabs@iitj.ac.in" className="hover:text-terminal-text">
                      devluplabs@iitj.ac.in
                      </a>
                    </div>
                                        
                    <div className="flex items-start text-terminal-dim">
                      <MapPin className="mr-2 h-5 w-5 text-terminal-accent flex-shrink-0 mt-0.5" />
                      <span>
                        IIT Jodhpur
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div>
                  <h2 className="text-xl font-semibold text-terminal-text mb-3">Connect With Us</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-terminal-dim">
                      <Globe className="mr-2 h-5 w-5 text-terminal-accent" />
                      <a 
                        href="https://devluplabs.tech/#/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center"
                      >
                        devluplabs.tech/
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    
                    <div className="flex items-center text-terminal-dim">
                      <Github className="mr-2 h-5 w-5 text-terminal-accent" />
                      <a 
                        href="https://github.com/devlup-labs" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center"
                      >
                        github.com/devlup-labs
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    
                    <div className="flex items-center text-terminal-dim">
                      <Linkedin className="mr-2 h-5 w-5 text-terminal-accent" />
                      <a 
                        href="https://linkedin.com/company/devlup-labs" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center"
                      >
                        linkedin.com/company/devlup-labs
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-terminal-text mb-3">To Contribute</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-terminal-dim">
                      <Github className="mr-2 h-5 w-5 text-terminal-accent" />
                      <a 
                        href="https://github.com/lakshyajain-0291/Devlup_SOC" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-text flex items-center"
                      >
                        lakshyajain-0291/Devlup_SOC
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    
                  </div>
                </div>

              </div>
              
            </div>
          </div>
          
          {/* Map Section
          <div className="mt-8 border border-terminal-dim rounded-lg overflow-hidden h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.9776748166994!2d77.6626092!3d12.8440536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6c972baa2361%3A0x38c6114d98d98770!2sPES%20University%20Electronic%20City%20Campus!5e0!3m2!1sen!2sin!4v1652429234925!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PES University Electronic City Campus Map"
            ></iframe>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
