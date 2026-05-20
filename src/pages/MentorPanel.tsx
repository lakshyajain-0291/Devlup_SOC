import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { fetchMentorProjects } from '../services/apiClient';
import MentorApplicationsManager from '../components/admin/MentorApplicationsManager';
import { ShieldAlert, BookOpen, User } from 'lucide-react';

const MentorPanel: React.FC = () => {
  const { logout, googleUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const verifyAuthorization = async () => {
    setIsVerifying(true);
    try {
      const liveProjects = await fetchMentorProjects();
      setProjects(liveProjects);
      if (liveProjects && liveProjects.length > 0) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      setIsAuthorized(false);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    verifyAuthorization();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/home', { replace: true });
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 min-h-[80vh] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-terminal-accent"></div>
        <p className="text-terminal-dim mt-4">Verifying mentor credentials...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 min-h-[85vh] flex flex-col justify-center items-center text-center">
        <div className="terminal-window border border-red-500 max-w-lg p-8 rounded-lg shadow-lg shadow-red-500/10">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/10 p-4 rounded-full text-red-500">
              <ShieldAlert size={48} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-terminal-text mb-6">
            Your Google Account (<strong>{googleUser?.email || 'N/A'}</strong>) is not registered as an active mentor for any live, ongoing projects.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/home')}
              className="bg-terminal-dim hover:bg-terminal-dim/80 text-white font-semibold"
            >
              Go to Home
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-transparent"
            >
              Logout / Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 min-h-[80vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-terminal-accent pb-4">
        <div>
          <h1 className="text-3xl font-bold text-terminal-accent flex items-center gap-3">
            <span className="text-4xl">&gt;_</span> Mentor Control Panel
          </h1>
          <p className="text-terminal-dim text-sm mt-1">
            Signed in as <span className="text-white font-medium">{googleUser?.name || googleUser?.email}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/home')}
            variant="outline"
            className="border-terminal-dim text-terminal-text hover:bg-terminal-dim/20 bg-transparent"
          >
            Home
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mentor Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="terminal-window border border-terminal-dim p-4 rounded-md">
            <h3 className="text-md font-bold text-terminal-accent flex items-center gap-2 mb-4 border-b border-terminal-dim/40 pb-2">
              <User size={16} /> Your Projects
            </h3>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-terminal-dim/10 border border-terminal-dim/30 rounded-md">
                  <div className="font-semibold text-white text-sm">{proj.project_title}</div>
                  <div className="text-xs text-terminal-accent mt-1 flex items-center gap-1.5 uppercase">
                    <BookOpen size={12} /> {proj.type} · Live
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List Area */}
        <div className="lg:col-span-3">
          <MentorApplicationsManager />
        </div>
      </div>
    </div>
  );
};

export default MentorPanel;
