import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { ChevronRight, BarChart2, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const Stats: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-terminal-accent mb-2">Site Analytics</h1>
          <div className="flex items-center gap-2 bg-terminal border border-terminal-dim px-4 py-2 rounded-md">
            <Terminal size={16} className="text-terminal-accent" />
            <span className="text-xs text-terminal-dim">Try: </span>
            <code className="text-terminal-text text-xs">stats --live</code>
          </div>
        </div>
        
        <p className="text-terminal-dim">
          Real-time visitor data and engagement metrics for DevlUp Labs SOC
        </p>
        
        <div className="flex items-center text-sm text-terminal-dim mt-4">
          <span>DevlUp Labs</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-terminal-text">Analytics</span>
        </div>
      </motion.div>
      
      <AnalyticsDashboard />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 p-6 bg-terminal border border-terminal-dim rounded-md"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-terminal-dim text-terminal-accent">
            <BarChart2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-terminal-text mb-2">
              About These Analytics
            </h3>
            <p className="text-sm text-terminal-dim mb-3">
              This dashboard shows real-time analytics data for the DevlUp Labs Summer of Code website.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-terminal-text font-medium mb-1 text-sm">Available Metrics</h4>
                <ul className="list-disc list-inside text-terminal-dim text-xs space-y-1">
                  <li>Total page views across all pages</li>
                  <li>Unique visitors based on session tracking</li>
                  <li>Most popular content and pages</li>
                  <li>Visit trends over time</li>
                  <li>Hourly traffic distribution</li>
                </ul>
              </div>
              <div>
                <h4 className="text-terminal-text font-medium mb-1 text-sm">Terminal Commands</h4>
                <div className="border-l-2 border-terminal-dim pl-3">
                  <code className="block text-xs text-terminal-accent mb-1">stats</code>
                  <span className="text-xs text-terminal-dim mb-2 block">Display basic analytics</span>
                  
                  <code className="block text-xs text-terminal-accent mb-1">stats --view analytics</code>
                  <span className="text-xs text-terminal-dim mb-2 block">Full analytics dashboard</span>
                  
                  <code className="block text-xs text-terminal-accent mb-1">stats --live</code>
                  <span className="text-xs text-terminal-dim block">Real-time monitoring mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;