import { useState } from 'react';

// Form Settings - Reading directly from environment variables
const FORM_SETTINGS = {
  // Google Form URL constructed from the form ID
  GOOGLE_FORM_URL: import.meta.env.VITE_GOOGLE_FORM_ID ? 
    `https://docs.google.com/forms/u/0/d/e/${import.meta.env.VITE_GOOGLE_FORM_ID}/formResponse` : 
    '',
  
  // Field mapping for Google Form fields
  FIELD_MAPPING: {
    name: import.meta.env.VITE_FORM_NAME_FIELD || '',
    email: import.meta.env.VITE_FORM_EMAIL_FIELD || '',
    profile: import.meta.env.VITE_FORM_PROFILE_FIELD || '',
    projectId: import.meta.env.VITE_FORM_PROJECT_FIELD || '',
    note: import.meta.env.VITE_FORM_NOTE_FIELD || '',
    proposal: import.meta.env.VITE_FORM_PROPOSAL_LINK_FIELD || ''
  }
};

interface FormData {
  [key: string]: string | File | undefined;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
}

// Function to upload a file and return the Google Forms compatible format
const uploadFile = async (file: File, fileName: string): Promise<string> => {
  try {
    // Log upload attempt for debugging
    console.log(`Processing file for upload: ${fileName}`, file);
    
    // Format the file data in the Google Forms expected format
    // This should be in the format: [[["fileId","fileName","mimeType"]]]
    // Since we can't actually upload to Google Drive directly from client,
    // we'll create a mock file ID
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const formattedFileData = JSON.stringify([[[fileId, file.name, file.type]]]);
    
    console.log('Formatted file data:', formattedFileData);
    return formattedFileData;
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error('Failed to process file for upload');
  }
};

// Main hook for Google Form submission
export const useGoogleForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<FormSubmissionResult | null>(null);

  const validateFormSettings = (): boolean => {
    if (!FORM_SETTINGS.GOOGLE_FORM_URL || !FORM_SETTINGS.GOOGLE_FORM_URL.includes('docs.google.com/forms')) {
      console.error('Google Form URL is not properly configured');
      return false;
    }
    
    // Check if we have basic field mappings
    const requiredFields = ['name', 'email', 'projectId'];
    const missingFields = requiredFields.filter(field => !FORM_SETTINGS.FIELD_MAPPING[field]);
    
    if (missingFields.length > 0) {
      console.error(`Missing required field mappings: ${missingFields.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const submitForm = async (formData: FormData): Promise<FormSubmissionResult> => {
    setIsSubmitting(true);
    setResult(null);
    
    try {
      // Check if form settings are valid
      if (!validateFormSettings()) {
        if (process.env.NODE_ENV === 'development') {
          console.info('DEV MODE: Simulating successful form submission');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setResult({
            success: true,
            message: 'Development mode: Form submission simulated successfully'
          });
          return { success: true, message: 'Development mode: Form submission simulated successfully' };
        }
        
        throw new Error('Google Form configuration is invalid');
      }

      // Process any file uploads first
      const processedData: Record<string, string> = {};
      
      for (const [key, value] of Object.entries(formData)) {
        if (value instanceof File) {
          // Process file for Google Forms format
          const fileData = await uploadFile(value, `${formData.name || 'file'}_${key}`);
          processedData[key] = fileData;
        } else if (value !== undefined) {
          processedData[key] = String(value);
        }
      }
      
      // Prepare form data for submission
      const urlEncodedData = new URLSearchParams();
      
      // Map form data to Google Form fields
      Object.entries(processedData).forEach(([key, value]) => {
        const fieldId = FORM_SETTINGS.FIELD_MAPPING[key];
        if (fieldId && value) {
          urlEncodedData.append(fieldId, value);
        }
      });
      
      // Debug the form data being sent
      console.log('Form data being submitted:', Object.fromEntries(urlEncodedData.entries()));
      
      // Submit the form
      await fetch(FORM_SETTINGS.GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for CORS issues with Google Forms
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData
      });
      
      // With no-cors mode, we can't really know if it succeeded
      // But if no error was thrown, we assume success
      const successResult = {
        success: true,
        message: 'Form submitted successfully'
      };
      
      setResult(successResult);
      return successResult;
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      const errorResult = {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
      
      setResult(errorResult);
      return errorResult;
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
    result
  };
};

export default useGoogleForm;