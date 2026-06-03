import React, { useState, useEffect } from 'react';
import TerminalHeader from '../components/TerminalHeader';
import { fetchResultsSetting, fetchResults } from '../services/apiClient';
import { motion } from 'framer-motion';
import { Award, Search, Users, ExternalLink, Cpu, ChevronRight } from 'lucide-react';
import { getTheme, themes } from '../config/themes';
import { Input } from '../components/ui/input';

interface Candidate {
  name: string;
  github: string;
}

interface Mentor {
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
  github?: string;
  image_url?: string;
}

interface ProjectResult {
  project_title: string;
  project_description: string;
  tech_stack: string[];
  category?: string;
  mentors: Mentor[];
  accepted_candidates: Candidate[];
}

const Results: React.FC = () => {
  const [showResults, setShowResults] = useState<boolean | null>(null);
  const [results, setResults] = useState<ProjectResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const settingData = await fetchResultsSetting();
      setShowResults(settingData.show_results);
      
      if (settingData.show_results) {
        const resultsData = await fetchResults();
        setResults(resultsData);
      }
    } catch (err) {
      console.error("Failed to load results:", err);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentTheme = getTheme();
  const colors = themes[currentTheme];
  const isWinter = currentTheme === 1;

  // Map local theme variables into a CSS style sheet
  const styleVariables = {
    '--terminal-accent': colors.terminalAccent,
    '--terminal-dim': colors.terminalDim,
    '--accent-glow': colors.accentGlow,
    '--terminal-text': colors.terminalText,
    '--accent-glow-30': colors.accentGlow30,
  } as React.CSSProperties;

  // Filter projects by title, tech stack, or candidate name
  const filteredResults = results.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesTitle = p.project_title.toLowerCase().includes(term);
    const matchesTech = p.tech_stack?.some(t => t.toLowerCase().includes(term)) || false;
    const matchesCandidate = p.accepted_candidates.some(c => 
      c.name.toLowerCase().includes(term) || c.github.toLowerCase().includes(term)
    );
    return matchesTitle || matchesTech || matchesCandidate;
  });

  // Framer-motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-terminal/95 flex flex-col items-center p-2 sm:p-4 overflow-x-hidden relative"
      style={styleVariables}
    >
      {/* Cyberpunk Card Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--terminal-accent), transparent);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .project-card-hover:hover .scan-line {
          opacity: 0.75;
        }
        .terminal-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .terminal-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 2px;
        }
        .terminal-scroll::-webkit-scrollbar-thumb {
          background: var(--terminal-accent);
          border-radius: 2px;
        }
        .terminal-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--terminal-dim);
        }
      `}} />

      <div className="terminal-window max-w-[100rem] w-full mx-auto my-4 sm:my-8">
        <TerminalHeader title="Accepted Mentees Results" />
        <div className="terminal-body min-h-[600px] p-3 sm:p-6 lg:p-8 scrollbar-hide relative">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terminal-accent mb-4"></div>
              <p className="text-terminal-dim">Decompressing program results...</p>
            </div>
          ) : showResults === false ? (
            // Results Not Declared Page
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center px-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-8"
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 
                   ${isWinter ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400" : "bg-terminal/30 border-[var(--terminal-dim)] text-[var(--terminal-accent)]"}`}
                >
                  <Cpu size={48} />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-terminal-text mb-4">
                Results Pending Declaration
              </h2>
              <p className="text-terminal-dim text-lg max-w-lg mb-8 leading-relaxed">
                The candidate selection lists for the Winter of Code program are currently being finalized by mentors. Please check back later once they are officially declared.
              </p>
              <div className="text-xs font-mono text-terminal-dim border border-terminal-dim/30 px-4 py-2 rounded bg-terminal-dim/5">
                STATUS: WAITING_FOR_ADMIN_DELEGATION
              </div>
            </motion.div>
          ) : (
            // Results Declared Page
            <div className="space-y-8">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-b border-terminal-dim/30 pb-4 sm:pb-6 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-terminal-accent/10 rounded-lg">
                    <Award className="text-terminal-accent w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-terminal-text">
                      Accepted Candidates
                    </h1>
                    <p className="text-xs sm:text-sm text-terminal-dim mt-1">
                      Congratulations to all selected mentees! Let the coding begin.
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-dim w-4 h-4" />
                  <Input
                    className="pl-10 bg-transparent border-terminal-dim text-white focus-visible:border-terminal-accent focus-visible:ring-1 focus-visible:ring-terminal-accent/30 w-full"
                    placeholder="Search by name, tech, or project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Projects Grid */}
              {filteredResults.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-terminal-dim/30 rounded-lg">
                  <p className="text-terminal-dim text-lg">No results matched your search term.</p>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
                >
                  {filteredResults.map((project) => (
                    <motion.div
                      key={project.project_title}
                      variants={itemVariants}
                      whileHover={{ 
                        y: -8, 
                        transition: { duration: 0.2, ease: "easeOut" } 
                      }}
                      className={`project-card-hover border p-4 sm:p-6 lg:p-8 bg-[#0D1117]/60 flex flex-col justify-between min-h-[240px] relative overflow-hidden group hover:border-terminal-accent/50 rounded-2xl transition-all duration-300
                        ${isWinter 
                          ? 'border-cyan-950/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                          : 'border-terminal-dim hover:shadow-[0_0_20px_var(--accent-glow-30)]'
                        }`}
                    >
                      {/* Sweep Laser Scanline */}
                      <div className="scan-line" />

                      <div className="space-y-6 w-full">
                        {/* Project Header & Mentors horizontally aligned */}
                        <div className="border-b border-terminal-dim/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <h3 className="text-2xl font-bold text-white group-hover:text-terminal-accent transition-colors leading-tight">
                            {project.project_title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                            <Users size={14} className="text-terminal-dim flex-shrink-0" />
                            <span className="text-xs font-semibold text-terminal-dim uppercase font-mono tracking-wider">Mentors:</span>
                            {project.mentors && project.mentors.length > 0 ? (
                              project.mentors.map(m => (
                                <span
                                  key={m.name}
                                  className={`text-xs font-mono px-2.5 py-1 rounded border font-bold whitespace-nowrap
                                    ${isWinter
                                      ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
                                      : 'bg-terminal-dim/10 border-terminal-dim/30 text-terminal-accent'
                                    }`}
                                >
                                  {m.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-terminal-dim italic">N/A</span>
                            )}
                          </div>
                        </div>

                        {/* Accepted Candidates */}
                        <div className="space-y-3">
                          <div className="text-xs font-semibold text-terminal-dim uppercase font-mono tracking-wider mb-2">
                            Accepted Candidates:
                          </div>
                          {project.accepted_candidates.length === 0 ? (
                            <div className="text-sm text-terminal-dim italic bg-terminal-dim/5 p-3 rounded border border-terminal-dim/10 font-mono">
                              No candidates selected
                            </div>
                          ) : (
                            <div className="pr-1">
                              <div className="grid grid-cols-1 gap-2.5">
                                {project.accepted_candidates.map(candidate => (
                                  <div
                                    key={candidate.name}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-black/30 border border-terminal-dim/10 hover:border-terminal-accent/30 hover:bg-terminal-accent/5 pl-4 hover:pl-6 transition-all duration-300 group/row"
                                  >
                                    <div className="text-sm sm:text-base font-mono font-bold text-white flex items-center gap-2">
                                      <ChevronRight size={14} className="text-terminal-accent animate-pulse group-hover/row:translate-x-1 transition-transform" />
                                      <span>{candidate.name}</span>
                                    </div>
                                    {candidate.github && (
                                      <a
                                        href={candidate.github.startsWith('http') ? candidate.github : `https://github.com/${candidate.github}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="self-start sm:self-auto text-terminal-accent hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono bg-terminal-accent/5 px-2.5 py-1 rounded border border-terminal-accent/10 hover:border-terminal-accent/40"
                                      >
                                        @{candidate.github} <ExternalLink size={12} />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
