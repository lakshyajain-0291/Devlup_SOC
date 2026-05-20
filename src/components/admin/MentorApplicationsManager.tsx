import React, { useState, useEffect } from 'react';
import { fetchMentorApplications, updateMentorApplicationStatus } from '../../services/apiClient';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { ExternalLink, Eye } from 'lucide-react';

const MentorApplicationsManager: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const { toast } = useToast();

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMentorApplications();
      setApplications(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load applications", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: string, projectNum: number) => {
    try {
      const payload: Record<string, string> = {};
      payload[`status_${projectNum}`] = status;
      await updateMentorApplicationStatus(id, payload);
      toast({ title: "Success", description: `Project Choice ${projectNum} marked as ${status}.` });
      loadApplications();
    } catch (err) {
      toast({ title: "Error", description: "Failed to update application status", variant: "destructive" });
    }
  };

  const isUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-terminal-accent">Applications for Your Project(s)</h2>
        <Button onClick={loadApplications} variant="outline" className="border-terminal-dim text-terminal-text hover:text-white hover:bg-terminal-dim/20 bg-transparent">
          Refresh
        </Button>
      </div>

      <div className="terminal-window border border-terminal-dim p-4">
        {isLoading ? (
          <p className="text-terminal-dim text-center py-4">Loading applications...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-terminal-dim">
                <TableHead className="text-terminal-text">Applicant</TableHead>
                <TableHead className="text-terminal-text">Roll No.</TableHead>
                <TableHead className="text-terminal-text">GitHub</TableHead>
                <TableHead className="text-terminal-text">Projects & Status</TableHead>
                <TableHead className="text-terminal-text text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-terminal-dim py-4">No applications received yet.</TableCell>
                </TableRow>
              )}
              {applications.map((app) => (
                <TableRow key={app.id} className="border-terminal-dim hover:bg-terminal-dim/20">
                  <TableCell className="font-medium text-white">
                    <div>{app.mentee_name || 'N/A'}</div>
                    <div className="text-xs text-terminal-dim">{app.mentee_email_id || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="text-terminal-text">{app.mentee_roll_number || 'N/A'}</TableCell>
                  <TableCell className="text-terminal-text">{app.mentee_github_id ? `@${app.mentee_github_id}` : 'N/A'}</TableCell>
                  <TableCell className="text-terminal-text text-sm">
                    {/* Dynamic project entries (safely masked by backend) */}
                    {(() => {
                      const projectKeys = Object.keys(app).filter(k => k.startsWith('project_name_') && app[k]).sort();
                      if (projectKeys.length === 0) return <span className="text-terminal-dim">No projects selected</span>;
                      return projectKeys.map((key, idx) => {
                        const num = key.replace('project_name_', '');
                        const statusKey = `status_${num}`;
                        return (
                          <div key={key} className={`flex items-center justify-between ${idx < projectKeys.length - 1 ? 'mb-2 pb-2 border-b border-terminal-dim/30' : ''}`}>
                            <div>
                              <div className="font-semibold text-white">{app[key]}</div>
                              <div className={`text-xs uppercase tracking-wider mt-1 ${app[statusKey] === 'accepted' ? 'text-green-400' : app[statusKey] === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {app[statusKey] || 'pending'}
                              </div>
                            </div>
                            <div className="flex gap-1 ml-4 bg-[#0D1117] rounded-md p-1 border border-terminal-dim/30">
                              <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(app.id, 'accepted', parseInt(num))} className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/10" title={`Accept Application`}>✅</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(app.id, 'rejected', parseInt(num))} className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10" title={`Reject Application`}>❌</Button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2 items-start pt-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" title="View Full Application">
                      <Eye size={16} />
                    </Button>
                    {/* Render URLs dynamically, but only those belonging to mentored choices */}
                    {(() => {
                      const mentoredChoices = Object.keys(app)
                        .filter(k => k.startsWith('project_name_') && app[k])
                        .map(k => k.replace('project_name_', ''));

                      return Object.entries(app).map(([key, val]) => {
                        if (typeof val === 'string' && isUrl(val)) {
                          // If it is a proposal URL, only show it if the corresponding choice is mentored by this user
                          if (
                            key === 'mentee_proposal_url' ||
                            key === 'mentee_prposoal_url' ||
                            key === 'mentee_proposal_url2' ||
                            (key.startsWith('project_') && key.endsWith('_proposal'))
                          ) {
                            const choiceNum = (key === 'mentee_proposal_url' || key === 'mentee_prposoal_url') ? '1' :
                                              (key === 'mentee_proposal_url2' ? '2' :
                                              key.replace('project_', '').replace('_proposal', ''));
                            if (!mentoredChoices.includes(choiceNum)) {
                              return null;
                            }
                          }
                          return (
                            <a key={key} href={val} target="_blank" rel="noreferrer">
                              <Button variant="ghost" size="sm" className="text-terminal-accent hover:text-terminal-accent/80 hover:bg-terminal-accent/10" title={`Open ${key}`}>
                                <ExternalLink size={16} />
                              </Button>
                            </a>
                          );
                        }
                        return null;
                      });
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl bg-[#0D1117] border border-terminal-dim text-white max-h-[80vh] overflow-y-auto modal-scroll">
          <DialogHeader>
            <DialogTitle className="text-terminal-accent text-xl">Application Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedApp && (() => {
              const mentoredChoices = Object.keys(selectedApp)
                .filter(k => k.startsWith('project_name_') && selectedApp[k])
                .map(k => k.replace('project_name_', ''));

              return Object.entries(selectedApp).map(([key, val]) => {
                if (key === 'id' || val === null || val === undefined || val === '') return null;
                
                // Hide any key that belongs to the masked other choice
                if (
                  key.includes('_1') ||
                  key.includes('_2') ||
                  key === 'mentee_proposal_url' ||
                  key === 'mentee_prposoal_url' ||
                  key === 'mentee_proposal_url2'
                ) {
                  const choiceNum = (key.includes('_1') || key === 'mentee_proposal_url' || key === 'mentee_prposoal_url') ? '1' : '2';
                  if (!mentoredChoices.includes(choiceNum)) {
                    return null;
                  }
                }

                const isLink = typeof val === 'string' && isUrl(val);
                return (
                  <div key={key} className="grid grid-cols-3 border-b border-terminal-dim/50 pb-2">
                    <div className="font-semibold text-terminal-dim capitalize">{key.replace(/_/g, ' ')}</div>
                    <div className="col-span-2 text-terminal-text break-words">
                      {isLink ? (
                        <a href={val as string} target="_blank" rel="noreferrer" className="text-terminal-accent hover:underline flex items-center gap-1">
                          {val as string} <ExternalLink size={14} />
                        </a>
                      ) : (
                        String(val || 'N/A')
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorApplicationsManager;
