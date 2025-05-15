import React, { useEffect, useState } from 'react';
import { useTerminal } from '../context/TerminalContext';
import TerminalHeader from '../components/TerminalHeader';
import { Award, Star, History, Code, Terminal as TerminalIcon } from 'lucide-react';

interface ActivityItem {
  type: 'project_view' | 'command' | 'achievement';
  timestamp: Date;
  details: string;
  projectId?: string;
}

const Memory = () => {
  const { commandHistory } = useTerminal();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Load activity history from localStorage
    const storedActivities = localStorage.getItem('user_activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities).map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      })));
    }

    // Check for achievements
    const storedAchievements = localStorage.getItem('user_achievements');
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    } else {
      // Default achievements if none stored
      const defaultAchievements = ['Terminal Explorer'];
      setAchievements(defaultAchievements);
      localStorage.setItem('user_achievements', JSON.stringify(defaultAchievements));
    }

    // Process command history to activities
    const newActivities = commandHistory
      .filter(cmd => cmd.type === 'command')
      .map(cmd => ({
        type: 'command' as const,
        timestamp: new Date(),
        details: typeof cmd.content === 'string' ? cmd.content : 'Command executed'
      }))
      .slice(-10);
    
    if (newActivities.length > 0) {
      setActivities(prev => [...prev, ...newActivities]);
    }

  }, [commandHistory]);

  // Save activities to localStorage when updated
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('user_activities', JSON.stringify(activities));
    }
  }, [activities]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-terminal flex flex-col items-center p-4">
      <div className="terminal-window max-w-4xl w-full mx-auto my-8">
        <TerminalHeader title="Memory - User Activity" />
        <div className="terminal-body min-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Achievements Section */}
            <div className="border border-terminal-dim p-4 rounded-md">
              <h2 className="text-terminal-accent font-bold text-lg flex items-center mb-4">
                <Award className="mr-2" size={20} />
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-center bg-terminal-dim/20 p-2 rounded">
                    <Star className="text-terminal-accent mr-2" size={16} />
                    <span>{achievement}</span>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <p className="text-terminal-dim">No achievements yet. Keep exploring!</p>
                )}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="border border-terminal-dim p-4 rounded-md">
              <h2 className="text-terminal-accent font-bold text-lg flex items-center mb-4">
                <History className="mr-2" size={20} />
                Recent Activity
              </h2>
              <div className="space-y-2">
                {activities.slice(-10).reverse().map((activity, idx) => (
                  <div key={idx} className="border-b border-terminal-dim/30 pb-2 mb-2 last:border-0">
                    <div className="flex items-center">
                      {activity.type === 'command' ? (
                        <Code className="text-terminal-dim mr-2" size={14} />
                      ) : activity.type === 'project_view' ? (
                        <TerminalIcon className="text-terminal-dim mr-2" size={14} />
                      ) : (
                        <Star className="text-terminal-accent mr-2" size={14} />
                      )}
                      <span className="text-terminal-text text-sm">{activity.details}</span>
                    </div>
                    <div className="text-terminal-dim text-xs mt-1">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-terminal-dim">No recent activity to display.</p>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Stats Section */}
          <div className="border border-terminal-dim p-4 rounded-md mt-6">
            <h2 className="text-terminal-accent font-bold text-lg mb-4">Terminal Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-terminal-dim/20 p-3 rounded-md">
                <div className="text-terminal-dim text-sm">Commands Run</div>
                <div className="text-terminal-text text-xl font-mono font-bold">
                  {commandHistory.filter(cmd => cmd.type === 'command').length}
                </div>
              </div>
              <div className="bg-terminal-dim/20 p-3 rounded-md">
                <div className="text-terminal-dim text-sm">Easter Eggs Found</div>
                <div className="text-terminal-text text-xl font-mono font-bold">
                  {Math.min(achievements.length, 3)}
                </div>
              </div>
              <div className="bg-terminal-dim/20 p-3 rounded-md">
                <div className="text-terminal-dim text-sm">Session Time</div>
                <div className="text-terminal-text text-xl font-mono font-bold">
                  {(Math.random() * 60).toFixed(0)}m
                </div>
              </div>
              <div className="bg-terminal-dim/20 p-3 rounded-md">
                <div className="text-terminal-dim text-sm">Shell Level</div>
                <div className="text-terminal-text text-xl font-mono font-bold">
                  {activities.length > 50 ? 3 : activities.length > 20 ? 2 : 1}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memory;