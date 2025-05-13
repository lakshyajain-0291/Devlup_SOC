import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd());
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Make env variables available in the client code
    // Prefix with VITE_ to expose to client
    define: {
      'import.meta.env.VITE_GOOGLE_SHEETS_ID': JSON.stringify(env.VITE_GOOGLE_SHEETS_ID || process.env.GOOGLE_SHEETS_ID || ''),
      'import.meta.env.VITE_GOOGLE_CLIENT_EMAIL': JSON.stringify(env.VITE_GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || ''),
      'import.meta.env.VITE_GOOGLE_PRIVATE_KEY': JSON.stringify(env.VITE_GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || ''),
      'import.meta.env.VITE_GOOGLE_FORM_ID': JSON.stringify(env.VITE_GOOGLE_FORM_ID || process.env.GOOGLE_FORM_ID || ''),
      'import.meta.env.VITE_FORM_NAME_FIELD': JSON.stringify(env.VITE_FORM_NAME_FIELD || process.env.FORM_NAME_FIELD || ''),
      'import.meta.env.VITE_FORM_EMAIL_FIELD': JSON.stringify(env.VITE_FORM_EMAIL_FIELD || process.env.FORM_EMAIL_FIELD || ''),
      'import.meta.env.VITE_FORM_PROFILE_FIELD': JSON.stringify(env.VITE_FORM_PROFILE_FIELD || process.env.FORM_PROFILE_FIELD || ''),
      'import.meta.env.VITE_FORM_PROJECT_FIELD': JSON.stringify(env.VITE_FORM_PROJECT_FIELD || process.env.FORM_PROJECT_FIELD || ''),
      'import.meta.env.VITE_FORM_NOTE_FIELD': JSON.stringify(env.VITE_FORM_NOTE_FIELD || process.env.FORM_NOTE_FIELD || ''),
      'import.meta.env.VITE_FORM_PROPOSAL_LINK_FIELD': JSON.stringify(env.VITE_FORM_PROPOSAL_LINK_FIELD || process.env.FORM_PROPOSAL_LINK_FIELD || ''),
    },
  };
});
