import axios from 'axios';
import { Project } from '../components/ProjectCard';
import { ContributorData } from '../components/ContributorForm';

// Ensure process polyfill is loaded
import '../lib/processPolyfill';

// Mock projects as fallback
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'AI-Powered Chatbot',
    description: 'Build a conversational AI chatbot using modern NLP techniques to assist students with programming questions.',
    techStack: ['Python', 'TensorFlow', 'Flask', 'React'],
    mentor: {
      name: 'Dr. Sarah Chen',
      role: 'AI Research Lead',
      email: 'sarah.chen@example.com',
      linkedin: 'https://linkedin.com/in/sarahchen'
    },
    category: '1' // Add category for testing
  },
  {
    id: '2',
    name: 'Cross-Platform Mobile Game',
    description: 'Develop an educational puzzle game that teaches programming concepts while entertaining users.',
    techStack: ['Unity', 'C#', 'Firebase', 'AR/VR'],
    mentor: {
      name: 'Michael Rodriguez',
      role: 'Game Development Instructor',
      email: 'michael.r@example.com'
    },
    category: 'soc x raid' // Add different category for testing
  },
  {
    id: '3',
    name: 'Sustainable Smart Home Dashboard',
    description: 'Create a dashboard to monitor and optimize energy usage in smart homes with ML-based recommendations.',
    techStack: ['React', 'Node.js', 'TensorFlow.js', 'IoT'],
    mentor: {
      name: 'Priya Sharma',
      role: 'IoT Specialist',
      email: 'priya.sharma@example.com',
      linkedin: 'https://linkedin.com/in/priyasharma'
    }
  },
  {
    id: '4',
    name: 'Open Source Contribution Tracker',
    description: 'Build a platform to track and reward open source contributions from students and community members.',
    techStack: ['TypeScript', 'Next.js', 'GraphQL', 'GitHub API'],
    mentor: {
      name: 'James Wilson',
      role: 'Open Source Advocate',
      email: 'james.wilson@example.com',
      linkedin: 'https://linkedin.com/in/jameswilson'
    }
  },
  {
    id: '5',
    name: 'Accessibility Testing Tool',
    description: 'Develop a browser extension that helps developers identify and fix accessibility issues in web applications.',
    techStack: ['JavaScript', 'Browser Extensions', 'ARIA', 'Testing'],
    mentor: {
      name: 'Elena Martinez',
      role: 'Accessibility Expert',
      email: 'elena.m@example.com'
    }
  }
];

// Parse CSV data into structured format
function parseCSV(csvText: string): any[] {
  // Split the CSV text into rows, handling '\r' characters
  const rows = csvText.split(/\r?\n/);
  
  if (rows.length <= 1) {
    return [];
  }
  
  // Check for potential tab separation instead of commas
  if (rows[0].includes('\t')) {
    return parseTabSeparatedValues(csvText);
  }
  
  // Function to parse a single line, respecting quotes
  function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    
    return result.map(field => {
      if (field.startsWith('"') && field.endsWith('"')) {
        return field.substring(1, field.length - 1);
      }
      return field.trim();
    });
  }
  
  const headers = parseLine(rows[0]);
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const rowData = parseLine(rows[i]);
    const rowObject: Record<string, string> = {};
    
    for (let j = 0; j < headers.length; j++) {
      rowObject[headers[j].trim()] = j < rowData.length ? rowData[j] : '';
    }
    
    data.push(rowObject);
  }
  
  return data;
}

// Function to parse tab-separated values (TSV)
function parseTabSeparatedValues(tsvText: string): any[] {
  const rows = tsvText.split(/\r?\n/);
  
  if (rows.length <= 1) {
    return [];
  }
  
  const headers = rows[0].split('\t').map(header => header.trim());
  
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const values = rows[i].split('\t');
    
    const rowObject: Record<string, string> = {};
    
    for (let j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = j < values.length ? values[j].trim() : '';
    }
    
    data.push(rowObject);
  }
  
  return data;
}

// Fetch projects from Google Sheets using CSV export
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const csvUrl = import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL || "";

    const response = await axios.get(csvUrl);
    
    const parsedData = parseCSV(response.data);
    
    if (!parsedData || parsedData.length === 0) {
      throw new Error('No project data found');
    }
    
    const projectsData = parsedData.map((item, index) => {
      const techStack = item['Tech Stack (Comma separated)'] || item['Tech Stack (Comma rated)'] ? 
        (item['Tech Stack (Comma separated)'] || item['Tech Stack (Comma rated)']).split(',').map((tech: string) => {
          return tech.trim().replace(/\b\w/g, char => char.toUpperCase());
        }) : [];

      return {
        id: String(index + 1),
        name: item['Project Name'] || '',
        description: item['description'] || '',
        techStack: techStack,
        mentor: {
          name: item['Mentor 1 Name'] || '',
          role: 'Project Mentor',
          email: item['Mentor 1 Email'] || '',
          linkedin: item['Mentor 1 LinkedIn Url'] || undefined,
          github: item['Mentor 1 Github Url'] || undefined
        },
        mentor2: item['Mentor 2 Name'] ? {
          name: item['Mentor 2 Name'] || '',
          role: 'Project Mentor',
          email: item['Mentor 2 Email'] || '',
          linkedin: item['Mentor 2 LinkedIn Url'] || undefined,
          github: item['Mentor 2 Github Url'] || undefined
        } : undefined,
        mentor3: item['Mentor 3 Name'] ? {
          name: item['Mentor 3 Name'] || '',
          role: 'Project Mentor',
          email: item['Mentor 3 Email'] || '',
          linkedin: item['Mentor 3 LinkedIn Url'] || undefined,
          github: item['Mentor 3 Github Url'] || undefined
        } : undefined,
        projectDoc: item['Project Doc'] || '',
        category: item['Category'] ? item['Category'].trim() : undefined
      };
    });
    
    return projectsData;
  } catch (error) {
    return MOCK_PROJECTS;
  }
};

// Form field mapping
const FORM_FIELD_MAPPING = {
  name: import.meta.env.VITE_FORM_NAME_FIELD || '',
  email: import.meta.env.VITE_FORM_EMAIL_FIELD || '',
  profile: import.meta.env.VITE_FORM_PROFILE_FIELD || '',
  projectId: import.meta.env.VITE_FORM_PROJECT_FIELD || '',
  note: import.meta.env.VITE_FORM_NOTE_FIELD || '',
  proposal: import.meta.env.VITE_FORM_PROPOSAL_LINK_FIELD || ''
};
