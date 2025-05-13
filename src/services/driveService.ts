import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as dotenv from 'dotenv';

// Ensure process polyfill is loaded
import '../lib/processPolyfill';

// Load environment variables
if (typeof process !== 'undefined') {
  dotenv.config();
}

// Config for Google Drive API - use Vite's import.meta.env for browser compatibility
const CLIENT_EMAIL = import.meta.env.VITE_GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || '';
const PRIVATE_KEY = (import.meta.env.VITE_GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || '')
  .replace(/\\n/g, '\n'); // Fix for escaped newlines in .env file

// Create a JWT auth client with error handling
const getAuthClient = () => {
  try {
    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
      console.warn('Missing Google API credentials. Check your environment variables.');
      return null;
    }
    
    return new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
  } catch (error) {
    console.error('Error creating JWT auth client:', error);
    return null;
  }
};

// Upload a file to Google Drive with better error handling
export const uploadFileToDrive = async (
  file: File,
  fileName: string
): Promise<string | null> => {
  try {
    // Get auth client
    const auth = getAuthClient();
    if (!auth) {
      throw new Error('Failed to create authentication client');
    }
    
    const drive = google.drive({ version: 'v3', auth });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: `${fileName}-${new Date().toISOString()}`,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: fileBuffer,
      },
      fields: 'id,webViewLink',
    });

    // Make the file viewable by anyone with the link
    if (response.data.id) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return response.data.webViewLink || null;
    }

    return null;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    return null;
  }
};