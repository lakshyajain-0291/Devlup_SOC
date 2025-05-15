import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recordPageVisit } from '../services/analyticsService';

/**
 * This component silently tracks page visits.
 * It should be included once in the app, likely in App.tsx
 */
const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Record the page visit whenever the location changes
    const path = location.pathname;
    recordPageVisit(path);
  }, [location]);

  // This component doesn't render anything
  return null;
};

export default AnalyticsTracker;