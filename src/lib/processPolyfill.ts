// This file provides polyfills for Node.js process features that are used by Google APIs
// but not available in browser environments

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Create a mock process object if it doesn't exist
  if (!(window as any).process) {
    (window as any).process = {};
  }
  
  // Add stdout and stderr with isTTY property
  if (!(window as any).process.stdout) {
    (window as any).process.stdout = { isTTY: false };
  }
  
  if (!(window as any).process.stderr) {
    (window as any).process.stderr = { isTTY: false };
  }

  // Add other process properties that might be used by libraries
  if ((window as any).process) {
    const process = (window as any).process;
    
    if (!process.env) process.env = {};
    if (!process.version) process.version = 'v16.0.0'; // Mock a Node.js version
    if (!process.nextTick) process.nextTick = (callback: Function, ...args: any[]) => setTimeout(() => callback(...args), 0);
    if (!process.platform) process.platform = 'browser';
    if (!process.emitWarning) process.emitWarning = (...args: any[]) => console.warn(...args);
  }
}