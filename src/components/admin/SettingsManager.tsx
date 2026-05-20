import React, { useState, useEffect } from 'react';
import { fetchResultsSetting, updateResultsSetting } from '../../services/apiClient';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';

const SettingsManager: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await fetchResultsSetting();
      setShowResults(data.show_results);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load results configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggleResults = async (checked: boolean) => {
    try {
      setShowResults(checked);
      await updateResultsSetting(checked);
      toast({
        title: checked ? "Results Published" : "Results Hidden",
        description: checked 
          ? "Accepted candidate names are now visible to the public." 
          : "Accepted candidate names have been hidden from the public.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update results configuration",
        variant: "destructive",
      });
      // Revert state on failure
      setShowResults(!checked);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-terminal-accent">Global Program Settings</h2>
      </div>

      <div className="terminal-window border border-terminal-dim p-6 bg-[#0D1117]/80 rounded-md">
        {isLoading ? (
          <p className="text-terminal-dim text-center py-4">Loading configurations...</p>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-terminal-dim/30 pb-6">
              <div className="space-y-1 max-w-xl">
                <Label htmlFor="results-visibility-toggle" className="text-lg font-bold text-white">
                  Publish Candidate Selection Results
                </Label>
                <p className="text-sm text-terminal-dim">
                  When enabled, a public "Results" tab will appear on the website navbar, displaying all accepted mentees grouped under their respective projects. When disabled, the results page is hidden and secured with a 403 authorization lock.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="results-visibility-toggle"
                  checked={showResults}
                  onCheckedChange={handleToggleResults}
                  className="border border-terminal-dim bg-black/60 data-[state=checked]:bg-terminal-accent data-[state=checked]:border-terminal-accent data-[state=unchecked]:bg-black/60 data-[state=unchecked]:border-terminal-dim"
                />
              </div>
            </div>
            
            <div className="text-xs text-terminal-dim bg-terminal-dim/10 p-3 rounded border border-terminal-dim/20">
              <span className="font-bold text-terminal-accent">Note:</span> Mentees must be marked as <span className="text-green-400 font-semibold">accepted</span> in the "Applications" tab by their project mentors (or an administrator) to appear in the published results list.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsManager;
