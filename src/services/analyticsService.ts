import axios from 'axios';

// Types for our analytics data
export interface PageVisit {
  page: string;
  timestamp: string;
  sessionId: string;
  referrer?: string;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  pageVisits: Record<string, number>;
  visitsByDay: Record<string, number>;
  visitsByHour: Record<string, number>; // Added for hourly distribution
}

// Generate a unique session ID for the current visitor
const generateSessionId = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${randomPart}-${Date.now()}`;
};

// Get or create a session ID
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('devlup_session_id');
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('devlup_session_id', sessionId);
  }
  
  return sessionId;
};

// Record a page visit to Google Sheet
export const recordPageVisit = async (page: string): Promise<boolean> => {
  try {
    const sessionId = getSessionId();
    const timestamp = new Date().toISOString();
    const referrer = document.referrer || '';
    
    // Using the CSV export URL of your Google Sheet to append data
    // We'll be using a Google Apps Script web app to handle writing data
    const scriptUrl = import.meta.env.VITE_ANALYTICS_SCRIPT_URL || '';
    
    if (!scriptUrl) {
      console.warn('Analytics script URL not configured');
      return false;
    }
    
    // Send the data to Google Sheets via Apps Script
    await axios.get(scriptUrl, {
      params: {
        page,
        timestamp,
        sessionId,
        referrer
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to record page visit:', error);
    return false;
  }
};

// Helper function to parse CSV lines safely
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last field
  result.push(currentValue.trim());
  return result;
};

// Fetch analytics data from Google Sheet
export const fetchAnalyticsData = async (): Promise<AnalyticsData | null> => {
  try {
    const csvUrl = import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL || '';
    
    if (!csvUrl) {
      console.warn('Google Sheets CSV URL not configured');
      return null;
    }
    
    // We'll be using a separate sheet for analytics within the same Google Sheets file
    // The regular CSV export URL with &sheet=Analytics to get the analytics sheet
    const analyticsSheetUrl = `${csvUrl}&gid=${import.meta.env.VITE_ANALYTICS_SHEET_GID}&output=csv`;
    
    const response = await axios.get(analyticsSheetUrl);
    
    // Process the CSV data
    const lines = response.data.split('\n');
    if (lines.length < 2) {
      return {
        totalVisits: 0,
        uniqueVisitors: 0,
        pageVisits: {},
        visitsByDay: {},
        visitsByHour: {}
      };
    }
    
    // Parse the analytics data
    const pageVisits: Record<string, number> = {};
    const sessionIds = new Set<string>();
    const visitsByDay: Record<string, number> = {};
    const visitsByHour: Record<string, number> = {};
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const parts = parseCSVLine(line);
      const page = parts[0] || '/';
      const timestamp = parts[1] || '';
      const sessionId = parts[2] || '';
      
      // Count page visits
      pageVisits[page] = (pageVisits[page] || 0) + 1;
      
      // Count unique visitors
      if (sessionId) {
        sessionIds.add(sessionId);
      }
      
      // Process timestamp data if available
      if (timestamp) {
        try {
          const date = new Date(timestamp);
          
          // Validate the date before using it
          if (!isNaN(date.getTime())) {
            // Group by day
            const dateStr = date.toISOString().split('T')[0];
            visitsByDay[dateStr] = (visitsByDay[dateStr] || 0) + 1;
            
            // Group by hour - extract the hour (0-23)
            const hour = date.getHours();
            visitsByHour[hour] = (visitsByHour[hour] || 0) + 1;
          }
        } catch (error) {
          console.warn(`Invalid timestamp: ${timestamp}`);
        }
      }
    }
    
    return {
      totalVisits: Math.max(0, lines.length - 1), // Subtract header row
      uniqueVisitors: sessionIds.size,
      pageVisits,
      visitsByDay,
      visitsByHour
    };
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    return null;
  }
};

// Get terminal-friendly analytics output
export const getTerminalStats = async (): Promise<string> => {
  try {
    const data = await fetchAnalyticsData();
    
    if (!data) {
      return "No analytics data available.";
    }
    
    // Format the top pages for terminal output
    let topPages = "";
    if (data.pageVisits && Object.keys(data.pageVisits).length > 0) {
      const sortedPages = Object.entries(data.pageVisits)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      topPages = sortedPages.map(([page, count], index) => {
        const pageName = page === '/' ? 'Home' : page.replace(/^\//, '');
        return `${index + 1}. ${pageName}: ${count} visits`;
      }).join("\n");
    }
    
    // Format stats for terminal
    return `
DevlUp Labs SOC - Analytics Summary
----------------------------------
Total Page Views: ${data.totalVisits}
Unique Visitors: ${data.uniqueVisitors}
Today's Visits: ${data.visitsByDay[new Date().toISOString().split('T')[0]] || 0}

Top Pages:
${topPages || "No page data available."}

Use 'stats --view analytics' to open the full dashboard
`;
  } catch (error) {
    console.error('Error generating terminal stats:', error);
    return "Error retrieving analytics data.";
  }
};