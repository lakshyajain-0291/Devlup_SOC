import React, { useState, useEffect } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';

export interface ContributorData {
  name: string;
  email: string;
  profile: string;
  projectId: string;
  note: string;
  proposal?: string;
}

interface ContributorFormProps {
  projects: { id: string; name: string }[];
  onSubmit: (data: ContributorData) => Promise<void>;
  initialProjectId?: string;
}

const ContributorForm: React.FC<ContributorFormProps> = ({ projects, initialProjectId = '' }) => {
  const [selectedProject, setSelectedProject] = useState<string>(initialProjectId);
  const googleFormUrl = import.meta.env.VITE_GOOGLE_FORM_URL || '';
  
  // Get the selected project name
  const selectedProjectName = projects.find(p => p.id === selectedProject)?.name || '';
    
  useEffect(() => {
    if (initialProjectId) {
      setSelectedProject(initialProjectId);
    }
  }, [initialProjectId]);
  
  // Handle project selection change
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-terminal-dim/20 p-4 rounded-md">
        <h3 className="text-terminal-accent font-medium mb-3">Application Process</h3>
        <p className="text-terminal-text mb-3">
          To apply for this project, please submit your application through our Google Form where you can:
        </p>
        <ul className="list-disc pl-5 text-terminal-dim mb-4 space-y-1">
          <li>Provide your contact information</li>
          <li>Share your GitHub/LinkedIn profile</li>
          <li>Submit a proposal document</li>
          <li>Tell us why you're interested in this project</li>
        </ul>
      </div>
      
      <div className="flex justify-center">
        <a 
          href={googleFormUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-terminal-accent hover:bg-terminal-accent/80 text-terminal-text px-6 py-3 rounded-md transition-colors flex items-center space-x-2"
        >
          <span>Open Application Form</span>
          <ExternalLink size={16} />
        </a>
      </div>
      
      <p className="text-terminal-dim text-sm text-center">
        The form will open in a new tab. Please make sure to mention projectyou want to apply to in the form.
      </p>
    </div>
  );
};

export default ContributorForm;
