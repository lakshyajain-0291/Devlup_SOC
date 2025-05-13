
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext';
import TerminalHeader from '../components/TerminalHeader';
import ContributorForm from '../components/ContributorForm';

const ApplyPage = () => {
  const location = useLocation();
  const { projects, handleContributorSubmit } = useTerminal();
  const selectedProjectId = location.state?.selectedProjectId || '';

  return (
    <div className="min-h-screen bg-terminal flex flex-col items-center p-4">
      <div className="terminal-window max-w-4xl w-full mx-auto my-8">
        <TerminalHeader title="Contributor Application Form" />
        <div className="terminal-body min-h-[500px] overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-xl text-terminal-text">Contributor Application</h2>
            <p className="text-terminal-dim">
              Fill out the following form to express your interest in contributing to one of our Summer of Code projects.
            </p>
            <ContributorForm 
              projects={projects.map(p => ({ id: p.id, name: p.name }))} 
              onSubmit={handleContributorSubmit} 
              initialProjectId={selectedProjectId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
