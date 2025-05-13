
import React from 'react';
import { useTerminal } from '../context/TerminalContext';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, X } from 'lucide-react';

const Projects = () => {
  const { 
    projects, 
    loading,
    searchQuery,
    setSearchQuery,
    techFilter,
    setTechFilter
  } = useTerminal();
  
  // Get all unique tech stacks
  const allTechStacks = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.techStack.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on search query and tech filter
  const filteredProjects = React.useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery ? 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) : 
        true;
      
      const matchesTech = techFilter ? 
        project.techStack.some(tech => tech.toLowerCase() === techFilter.toLowerCase()) : 
        true;
      
      return matchesSearch && matchesTech;
    });
  }, [projects, searchQuery, techFilter]);

  return (
    <div className="min-h-screen bg-terminal p-4">
      <div className="max-w-4xl w-full mx-auto my-8">
        <h1 className="text-3xl font-bold text-terminal-text mb-6">Browse Projects</h1>
        
        <div className="space-y-6">
          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-2.5 text-terminal-dim" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 w-full bg-terminal-dim/20 border border-terminal-dim/50 rounded focus:outline-none focus:border-terminal-accent"
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5 text-terminal-dim hover:text-terminal-text"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {/* Tech stack filter */}
            <div className="w-full md:w-64">
              <select
                value={techFilter || ''}
                onChange={(e) => setTechFilter(e.target.value || null)}
                className="w-full px-3 py-2 bg-terminal-dim/20 border border-terminal-dim/50 rounded focus:outline-none focus:border-terminal-accent appearance-none"
              >
                <option value="">All Technologies</option>
                {allTechStacks.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Projects list */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-terminal-accent">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-terminal-error">No projects match your criteria.</p>
              <button 
                className="mt-3 text-terminal-accent hover:underline"
                onClick={() => {
                  setSearchQuery('');
                  setTechFilter(null);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
