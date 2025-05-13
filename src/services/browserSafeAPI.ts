/**
 * This file provides browser-safe methods to interact with Google APIs
 * without using libraries that depend on Node.js features
 */

// Simplified fetch handler for Google Sheets API
export async function fetchSheetData(
  sheetId: string,
  apiKey: string,
  range: string = 'Sheet1!A1:Z1000'
): Promise<any[]> {
  try {
    // Use the public API endpoint with API key instead of OAuth
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return formatSheetData(data.values || []);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

// Helper function to convert raw sheet data to structured format
function formatSheetData(rows: string[][]): any[] {
  if (rows.length < 2) {
    return [];
  }
  
  // First row contains headers
  const headers = rows[0];
  
  // Rest of the rows contain data
  return rows.slice(1).map((row) => {
    const item: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      // Map the cell to its corresponding header
      if (index < row.length) {
        item[header.trim()] = row[index];
      } else {
        item[header.trim()] = '';
      }
    });
    
    return item;
  });
}

// Submit form data directly to a Google Form
export async function submitToGoogleForm(
  formUrl: string,
  data: Record<string, string>,
  fieldMappings: Record<string, string>
): Promise<boolean> {
  try {
    // Validate the form URL
    if (!formUrl || !formUrl.includes('docs.google.com/forms')) {
      console.warn('Google Form URL is not properly configured:', formUrl);
      if (import.meta.env?.DEV) {
        console.info('DEV MODE: Simulating successful form submission');
        return true;
      }
      throw new Error('Google Form URL is not properly configured');
    }

    // Create form URL encoded data
    const formUrlEncoded = new URLSearchParams();
    
    // Map the data fields to form fields using provided mappings
    Object.entries(data).forEach(([key, value]) => {
      const formField = fieldMappings[key];
      if (formField) {
        formUrlEncoded.append(formField, value);
      }
    });
    
    console.log('Form data:', formUrlEncoded.toString());
    console.log('Submitting to Google Form URL:', formUrl);
    console.log('Form fields:', {
      ...fieldMappings,
      ...data
    });

    const response = await fetch(formUrl, {
      method: 'POST',
      body: formUrlEncoded,
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Response:', response);
    
    // Since 'no-cors' mode doesn't give us response details,
    // we assume success if no error is thrown
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
}
