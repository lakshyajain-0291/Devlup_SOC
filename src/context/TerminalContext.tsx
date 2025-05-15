import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommandResponse } from '../components/CommandOutput';
import { fetchProjects } from '../services/sheetsService';
import { Project } from '../components/ProjectCard';
import { ContributorData } from '../components/ContributorForm';
import ProjectCard from '../components/ProjectCard';
import ContributorForm from '../components/ContributorForm';
import { getTerminalStats } from '../services/analyticsService'; // Import analytics functions

// Easter egg helpers
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

// Track if we're in easter egg mode for certain animations
let matrixInterval: any = null;
let hackInterval: any = null;

// Programming quotes for fortune command
const PROGRAMMING_QUOTES = [
  "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
  "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
  "Sometimes it's better to leave something alone, to pause, and that's very true of programming. - Joyce Wheeler",
  "Testing leads to failure, and failure leads to understanding. - Burt Rutan",
  "The most damaging phrase in the language is 'We've always done it this way.' - Grace Hopper",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
  "First, solve the problem. Then, write the code. - John Johnson",
  "The best error message is the one that never shows up. - Thomas Fuchs",
  "It's not a bug – it's an undocumented feature. - Anonymous",
  "Without requirements or design, programming is the art of adding bugs to an empty text file. - Louis Srygley",
  "Before software can be reusable it first has to be usable. - Ralph Johnson",
  "The best way to predict the future is to implement it. - David Heinemeier Hansson",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "Make it work, make it right, make it fast. - Kent Beck"
];

// ASCII Art for easter eggs
const COFFEE_ASCII = `
    ( (
     ) )
  ._______.
  |       |]
  \\       /
   \`-----'
`;

const COWSAY_TEMPLATE = (message: string) => `
  ${'_'.repeat(message.length + 2)}
 < ${message} >
  ${'‾'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;

// Keyboard shortcuts info for the shortcuts command
const KEYBOARD_SHORTCUTS = `
KEYBOARD SHORTCUTS
=================
Navigation:
  Alt+H       - Navigate to Home page
  Alt+P       - Navigate to Projects page
  Alt+A       - Navigate to Apply page
  Alt+S       - Navigate to Stats page
  Alt+C       - Navigate to Contact page
  Alt+Shift+T - Switch to Terminal View

Terminal Commands:
  shortcuts   - Show this help
  help        - Show terminal commands

Note: You can also press ? anywhere to see keyboard shortcuts
`;

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
  checkKonamiCode: (key: string) => void;
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

  const checkKonamiCode = (key: string) => {
    if (key === KONAMI_CODE[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI_CODE.length) {
        konamiIndex = 0;
        addToHistory({ 
          type: 'response', 
          content: "🎮 KONAMI CODE ACTIVATED! You've unlocked dark mode!" 
        });
        
        document.body.classList.toggle('konami-mode');
        
        if (!document.getElementById('konami-style')) {
          const style = document.createElement('style');
          style.id = 'konami-style';
          style.textContent = `
            body.konami-mode {
              filter: invert(1) hue-rotate(180deg);
              transition: all 0.5s ease;
            }
            body.konami-mode .terminal-input {
              text-shadow: 0 0 5px #58A6FF;
            }
            body.konami-mode .terminal-cursor {
              box-shadow: 0 0 10px #58A6FF;
            }
          `;
          document.head.appendChild(style);
        }
      }
    } else {
      konamiIndex = 0;
    }
  };

  useEffect(() => {
    return () => {
      if (matrixInterval) clearInterval(matrixInterval);
      if (hackInterval) clearInterval(hackInterval);
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      
      try {
        const data = await fetchProjects();
        
        if (data.length === 0) {
          addToHistory({ 
            type: 'error', 
            content: 'Unable to fetch live project data. Displaying mock projects instead.' 
          });
        }
        
        setProjects(data);
      } catch (error) {
        addToHistory({ 
          type: 'error', 
          content: 'Failed to fetch projects. Please try again later.' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const addToHistory = (response: CommandResponse) => {
    setCommandHistory(prev => [...prev, response]);
  };

  const addToTerminalHistory = (command: string) => {
    addToHistory({ type: 'command', content: command });
  };

  const startMatrixAnimation = () => {
    if (matrixInterval) clearInterval(matrixInterval);
    
    let frames = 0;
    const maxFrames = 20;
    
    addToHistory({
      type: 'code',
      content: 'Initializing matrix mode...'
    });
    
    matrixInterval = setInterval(() => {
      if (frames >= maxFrames) {
        clearInterval(matrixInterval);
        matrixInterval = null;
        return;
      }
      
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン';
      let line = '';
      for (let i = 0; i < 40; i++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      
      addToHistory({
        type: 'code',
        content: line
      });
      
      frames++;
    }, 200);
  };
  
  const startHackAnimation = () => {
    if (hackInterval) clearInterval(hackInterval);
    
    const hackMessages = [
      "Initiating hack sequence...",
      "Bypassing firewall...",
      "Accessing mainframe...",
      "Decrypting security protocols...",
      "Injecting payload...",
      "Covering tracks...",
      "Erasing logs...",
      "Hack complete! Just kidding, that's not how hacking works 😉"
    ];
    
    let messageIndex = 0;
    
    addToHistory({
      type: 'code',
      content: '> Hack initiated. Please wait...'
    });
    
    hackInterval = setInterval(() => {
      if (messageIndex >= hackMessages.length) {
        clearInterval(hackInterval);
        hackInterval = null;
        return;
      }
      
      const progressChars = "⣾⣽⣻⢿⡿⣟⣯⣷";
      const randomChar = progressChars[Math.floor(Math.random() * progressChars.length)];
      
      addToHistory({
        type: 'code',
        content: `${randomChar} ${hackMessages[messageIndex]}`
      });
      
      messageIndex++;
    }, 800);
  };

  const processCommand = async (command: string) => {
    const commandLower = command.toLowerCase().trim();
    const parts = commandLower.split(' ');
    const baseCommand = parts[0];
    const args = parts.slice(1);
    
    addToHistory({ type: 'command', content: command });
    
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
  mentors, m               Show all project mentors
  shortcuts, keys          Display keyboard shortcuts`
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

      case 'stats':
        if (args.includes('--view') && (args.includes('analytics') || args.includes('dashboard'))) {
          window.location.href = '/stats';
          addToHistory({ 
            type: 'response', 
            content: 'Opening analytics dashboard...' 
          });
        } else if (args.includes('--live')) {
          addToHistory({ 
            type: 'response', 
            content: 'Live analytics mode. Stats will update every 10 seconds. Press Ctrl+C to exit.' 
          });
          
          const updateStats = async () => {
            const statsText = await getTerminalStats();
            addToHistory({ 
              type: 'code', 
              content: statsText 
            });
          };
          
          await updateStats();
          
          setInterval(updateStats, 10000);
        } else {
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
        
      case 'matrix':
        addToHistory({ 
          type: 'response', 
          content: 'Entering the Matrix...' 
        });
        startMatrixAnimation();
        break;
        
      case 'coffee':
      case 'caffeine':
        addToHistory({ 
          type: 'code', 
          content: COFFEE_ASCII
        });
        addToHistory({ 
          type: 'response', 
          content: 'Coffee break! Every good developer needs caffeine ☕'
        });
        break;
        
      case 'fortune':
        const randomQuote = PROGRAMMING_QUOTES[Math.floor(Math.random() * PROGRAMMING_QUOTES.length)];
        addToHistory({ 
          type: 'code', 
          content: `"${randomQuote}"`
        });
        break;
        
      case 'hack':
      case 'hacker':
        startHackAnimation();
        break;
        
      case 'cowsay':
        const message = parts.slice(1).join(' ') || 'Moo! Type a message after cowsay!';
        addToHistory({ 
          type: 'code', 
          content: COWSAY_TEMPLATE(message)
        });
        break;
        
      case 'colors':
      case 'colors!':
        addToHistory({ 
          type: 'code',
          content: 'Taste the rainbow!'
        });
        const rainbow = '🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣';
        addToHistory({ type: 'code', content: rainbow });
        const styleEl = document.createElement('style');
        styleEl.textContent = `
          .terminal-text, .command {
            animation: rainbow 3s linear infinite;
          }
          @keyframes rainbow {
            0% { color: #ff0000; }
            16% { color: #ff8000; }
            33% { color: #ffff00; }
            50% { color: #00ff00; }
            66% { color: #00ffff; }
            83% { color: #0000ff; }
            100% { color: #ff00ff; }
          }
        `;
        document.head.appendChild(styleEl);
        setTimeout(() => {
          document.head.removeChild(styleEl);
        }, 5000);
        break;
        
      case 'konami':
        addToHistory({ 
          type: 'response',
          content: 'Try pressing: ↑ ↑ ↓ ↓ ← → ← → B A'
        });
        break;
        
      case 'about':
        addToHistory({ 
          type: 'response',
          content: 'DevlUp Labs Summer of Code - A terminal-themed platform for open source projects'
        });
        addToHistory({ 
          type: 'code',
          content: `
Built with:
- React 18 with TypeScript
- Tailwind CSS with custom terminal theme
- Shadcn/UI components
- Love for coding 💻❤️

Try some hidden commands! Type "easteregg" to see a hint.`
        });
        break;
        
      case 'easteregg':
      case 'eastereggs':
        addToHistory({ 
          type: 'response',
          content: "🥚 Easter Egg Hunt: There are several hidden commands in this terminal! Try these: matrix, coffee, fortune, hack, cowsay, colors!, konami"
        });
        break;

      case 'shortcuts':
      case 'keys':
      case 'hotkeys':
        addToHistory({
          type: 'code',
          content: KEYBOARD_SHORTCUTS
        });
        break;

      default:
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
      addToHistory({ 
        type: 'response',
        content: 'Please submit your information through the Google Form that opened in a new tab.' 
      });
      return Promise.resolve();
    } catch (error) {
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
    checkKonamiCode,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
};
