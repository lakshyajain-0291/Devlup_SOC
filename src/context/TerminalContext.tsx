import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommandResponse } from '../components/CommandOutput';
import { fetchProjects } from '../services/sheetsService';
import { Project } from '../components/ProjectCard';
import { ContributorData } from '../components/ContributorForm';
import ProjectCard from '../components/ProjectCard';
import ContributorForm from '../components/ContributorForm';
import { getTerminalStats } from '../services/analyticsService'; // Import analytics functions

// Update the CommandResponse type in the file
interface TerminalContextType {
  commandHistory: CommandResponse[];
  projects: Project[];
  loading: boolean;
  isProcessing: boolean;
  executeCommand: (command: string) => void;
  handleContributorSubmit: (data: ContributorData) => Promise<void>;
  view: 'terminal' | 'projects' | 'form';
  setView: React.Dispatch<React.SetStateAction<'terminal' | 'projects' | 'form'>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  techFilter: string | null;
  setTechFilter: React.Dispatch<React.SetStateAction<string | null>>;
  addToTerminalHistory: (command: string) => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const useTerminal = (): TerminalContextType => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};

interface TerminalProviderProps {
  children: React.ReactNode;
}

export const TerminalProvider: React.FC<TerminalProviderProps> = ({ children }) => {
  const [commandHistory, setCommandHistory] = useState<CommandResponse[]>([
    { 
      type: 'response', 
      content: `Welcome to DevlUp Labs Summer of Code Terminal!\nType 'help' to see available commands.` 
    }
  ]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView] = useState<'terminal' | 'projects' | 'form'>('terminal');
  const [searchQuery, setSearchQuery] = useState('');
  const [techFilter, setTechFilter] = useState<string | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      // console.log('Starting to fetch projects...');
      setLoading(true);
      
      try {
        // console.log('Calling fetchProjects()...');
        const data = await fetchProjects();
        // console.log('Projects fetched successfully:', data);
        
        if (data.length === 0) {
          // console.warn('No projects were fetched, using mock data instead');
          addToHistory({ 
            type: 'error', 
            content: 'Unable to fetch live project data. Displaying mock projects instead.' 
          });
        }
        
        setProjects(data);
        // console.log('Projects state updated with:', data);
      } catch (error) {
        // console.error('Failed to fetch projects:', error);
        addToHistory({ 
          type: 'error', 
          content: 'Failed to fetch projects. Please try again later.' 
        });
      } finally {
        setLoading(false);
        // console.log('Project loading completed, loading state set to false');
      }
    };

    loadProjects();
  }, []);

  const addToHistory = (response: CommandResponse) => {
    setCommandHistory(prev => [...prev, response]);
  };

  // New function to add raw command to history
  const addToTerminalHistory = (command: string) => {
    addToHistory({ type: 'command', content: command });
  };

  const processCommand = async (command: string) => {
    const commandLower = command.toLowerCase().trim();
    const parts = commandLower.split(' ');
    const baseCommand = parts[0];
    const args = parts.slice(1);
    
    // Add the command to history first
    addToHistory({ type: 'command', content: command });
    
    // Process the command
    switch(baseCommand) {
      case 'help':
      case 'h':
      case '?':
        addToHistory({ 
          type: 'help', 
          content: 
`Available commands:
  help, h, ?               Show this help message
  clear, cls, c            Clear command history
  projects, p, ls          Show all available projects
  search [query], s [query]  Search for projects
  filter [tech], f [tech]    Filter projects by technology
  view [id], v [id], [id]    View details of a specific project
  stats [options]          View site analytics data
  apply, a                 Open the contributor application form
  mentors, m               Show all project mentors`
        });
        break;
        
      case 'clear':
      case 'cls':
      case 'c':
        setCommandHistory([]);
        break;
        
      case 'projects':
      case 'p':
      case 'ls':
        setView('projects');
        addToHistory({ 
          type: 'response', 
          content: 'Showing all projects. Type "search [query]" to search projects or "filter [technology]" to filter by technology.' 
        });
        break;

      // Stats command handler
      case 'stats':
        if (args.includes('--view') && (args.includes('analytics') || args.includes('dashboard'))) {
          // Redirect to analytics dashboard
          window.location.href = '/stats';
          addToHistory({ 
            type: 'response', 
            content: 'Opening analytics dashboard...' 
          });
        } else if (args.includes('--live')) {
          // Display live stats with refresh
          addToHistory({ 
            type: 'response', 
            content: 'Live analytics mode. Stats will update every 10 seconds. Press Ctrl+C to exit.' 
          });
          
          // Setup a temporary interval to update stats (will stop when user navigates away)
          const updateStats = async () => {
            const statsText = await getTerminalStats();
            addToHistory({ 
              type: 'code', 
              content: statsText 
            });
          };
          
          // Initial update
          await updateStats();
          
          // Setup interval (we don't need to clear it since it's just for demo)
          setInterval(updateStats, 10000);
        } else {
          // Display basic stats
          const statsText = await getTerminalStats();
          addToHistory({ 
            type: 'code', 
            content: statsText 
          });
        }
        break;
        
      case 'list':
        if (parts[1] === 'projects' || !parts[1]) {
          setView('projects');
          addToHistory({ 
            type: 'response', 
            content: 'Showing all projects. Type "search [query]" to search projects or "filter [technology]" to filter by technology.' 
          });
        } else {
          addToHistory({ 
            type: 'error', 
            content: `Unknown list type: ${parts[1]}. Type "help" for available commands.` 
          });
        }
        break;
        
      case 'search':
      case 's':
        const query = parts.slice(1).join(' ');
        if (!query) {
          addToHistory({ 
            type: 'error', 
            content: 'Please specify a search query. Example: search AI' 
          });
        } else {
          setSearchQuery(query);
          setView('projects');
          addToHistory({ 
            type: 'response', 
            content: `Searching projects for: ${query}` 
          });
        }
        break;
        
      case 'filter':
      case 'f':
        const tech = parts.slice(1).join(' ');
        if (tech) {
          setTechFilter(tech);
          setView('projects');
          addToHistory({ 
            type: 'response', 
            content: `Filtering projects by technology: ${tech}` 
          });
        } else {
          addToHistory({ 
            type: 'error', 
            content: 'Please specify a technology. Example: filter React' 
          });
        }
        break;
        
      case 'view':
      case 'v':
        if (parts[1]) {
          const projectId = parts[1];
          const project = projects.find(p => p.id === projectId);
          
          if (project) {
            addToHistory({ 
              type: 'project', 
              content: <ProjectCard project={project} />
            });
          } else {
            addToHistory({ 
              type: 'error', 
              content: `Project with ID ${projectId} not found.` 
            });
          }
        } else {
          addToHistory({ 
            type: 'error', 
            content: `Please specify a project ID. Example: view 1` 
          });
        }
        break;

      case 'mentors':
      case 'm':
        // Extract all mentors (primary, secondary, and tertiary)
        const allMentors = projects.flatMap(project => {
          const mentors = [project.mentor];
          if (project.mentor2) mentors.push(project.mentor2);
          if (project.mentor3) mentors.push(project.mentor3);
          return mentors;
        }).filter(mentor => mentor && mentor.name);
        
        addToHistory({
          type: 'mentor',
          content: (
            <div className="space-y-3">
              <p className="text-terminal-accent font-semibold">Project Mentors ({allMentors.length}):</p>
              {allMentors.map((mentor, index) => (
                <div key={index} className="pl-2 border-l border-terminal-dim">
                  <div className="font-semibold">{mentor.name}</div>
                  <div className="text-terminal-dim text-sm">{mentor.role}</div>
                  {mentor.email && (
                    <a href={`mailto:${mentor.email}`} className="text-terminal-accent text-sm block">{mentor.email}</a>
                  )}
                  {mentor.linkedin && (
                    <a href={mentor.linkedin} className="text-terminal-accent text-sm block" target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  )}
                  {mentor.github && (
                    <a href={mentor.github} className="text-terminal-accent text-sm block" target="_blank" rel="noopener noreferrer">
                      GitHub Profile
                    </a>
                  )}
                </div>
              ))}
            </div>
          )
        });
        break;
        
      case 'apply':
      case 'a':
        setView('form');
        addToHistory({ 
          type: 'form', 
          content: 'Opening contributor application form...' 
        });
        break;
        
      default:
        // Check if input is just a number (project ID)
        if (/^\d+$/.test(parts[0])) {
          const projectId = parts[0];
          const project = projects.find(p => p.id === projectId);
          
          if (project) {
            addToHistory({ 
              type: 'project', 
              content: <ProjectCard project={project} />
            });
          } else {
            addToHistory({ 
              type: 'error', 
              content: `Project with ID ${projectId} not found.` 
            });
          }
        } else {
          addToHistory({ 
            type: 'error', 
            content: `Unknown command: ${command}. Type "help" for available commands.` 
          });
        }
    }
  };

  const executeCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      await processCommand(command);
    } catch (error) {
      // console.error('Error executing command:', error);
      addToHistory({ 
        type: 'error', 
        content: 'An error occurred while processing your command.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContributorSubmit = async (data: ContributorData) => {
    try {
      setIsProcessing(true);
      // Simply show success message since we're using direct Google Form link
      addToHistory({ 
        type: 'response',
        content: 'Please submit your information through the Google Form that opened in a new tab.' 
      });
      return Promise.resolve();
    } catch (error) {
      // console.error('Error with application process:', error);
      addToHistory({ 
        type: 'error', 
        content: 'There was an issue opening the application form. Please try again.' 
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    commandHistory,
    projects,
    loading,
    isProcessing,
    executeCommand,
    handleContributorSubmit,
    view,
    setView,
    searchQuery,
    setSearchQuery,
    techFilter,
    setTechFilter,
    addToTerminalHistory,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
};
