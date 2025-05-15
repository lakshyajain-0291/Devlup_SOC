import React, { useEffect, useState } from 'react';
import { fetchAnalyticsData, AnalyticsData } from '../services/analyticsService';
import { Activity, Users, Eye, BarChart2, TrendingUp, Award, Clock, Globe } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';

// More professional, consistent color palette
const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e'];

// Map page paths to readable names
const PAGE_NAME_MAP: Record<string, string> = {
  '/': 'Home',
  '/projects': 'Projects List',
  '/stats': 'Analytics',
  '/apply': 'Application',
  '/contact': 'Contact'
};

// Format page names for display
const formatPageName = (path: string): string => {
  // Check if it's in our map
  if (PAGE_NAME_MAP[path]) {
    return PAGE_NAME_MAP[path];
  }
  
  // Check if it's a project detail page
  if (path.startsWith('/projects/')) {
    const projectId = path.split('/').pop();
    return `Project #${projectId}`;
  }
  
  // Otherwise just capitalize and remove slashes
  return path
    .replace(/\//g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Unknown';
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-terminal-accent p-3 rounded-md shadow-lg">
        <p className="text-card-foreground font-medium text-sm">{`${label || ''}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}></span>
            <span style={{ color: entry.color || COLORS[index % COLORS.length] }}>
              {`${entry.name || 'Visits'}: ${entry.value}`}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * A visually engaging analytics dashboard
 */
const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const analytics = await fetchAnalyticsData();
      setData(analytics);
      setLoading(false);
    };

    loadAnalytics();
    // Refresh every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Process page visit data with proper naming
  const preparePageVisitsData = () => {
    if (!data?.pageVisits) return [];
    
    return Object.entries(data.pageVisits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count], index) => ({
        name: formatPageName(page),
        visits: count,
        color: COLORS[index % COLORS.length]
      }));
  };

  // Format time-based data with proper ranges
  const prepareDailyVisitsData = () => {
    if (!data?.visitsByDay) return [];
    
    const entries = Object.entries(data.visitsByDay)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
      
    // Filter based on time range
    const today = new Date();
    const filteredEntries = entries.filter(([dateStr]) => {
      const date = new Date(dateStr);
      
      if (timeRange === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return date >= oneWeekAgo;
      } else if (timeRange === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return date >= oneMonthAgo;
      }
      
      return true;
    });
    
    return filteredEntries.map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: count
    }));
  };

  // Prepare heatmap data by hour of day
  const prepareHourlyData = () => {
    if (!data?.visitsByHour) return [];
    
    return Object.entries(data?.visitsByHour || {})
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        visits: count,
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  };

  // Display loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-terminal-accent text-center">
          <div className="animate-spin mb-2">
            <Clock size={24} className="inline-block" />
          </div>
          <p className="text-terminal-text animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Display error message if no data
  if (!data) {
    return (
      <div className="text-terminal-dim p-4 text-center">
        <p>No statistics available yet. Check back soon!</p>
      </div>
    );
  }

  const pageVisitsData = preparePageVisitsData();
  const dailyVisitsData = prepareDailyVisitsData();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-2xl font-bold text-terminal-text">
          Dashboard Analytics
        </h2>
        
        <div className="flex space-x-2 text-sm">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${timeRange === 'week' 
              ? 'bg-terminal-accent text-terminal' 
              : 'bg-terminal text-terminal-dim hover:text-terminal-text'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded ${timeRange === 'month' 
              ? 'bg-terminal-accent text-terminal' 
              : 'bg-terminal text-terminal-dim hover:text-terminal-text'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded ${timeRange === 'all' 
              ? 'bg-terminal-accent text-terminal' 
              : 'bg-terminal text-terminal-dim hover:text-terminal-text'}`}
          >
            All Time
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Visits */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-terminal border-terminal-dim hover:border-terminal-accent transition-colors duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-terminal-text">
                <Eye className="h-5 w-5 text-terminal-accent" /> 
                Total Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-terminal-text">
                {formatNumber(data.totalVisits)}
              </p>
              <p className="text-xs text-terminal-dim mt-1">
                Page views tracked
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Unique Visitors */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-terminal border-terminal-dim hover:border-terminal-accent transition-colors duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-terminal-text">
                <Users className="h-5 w-5 text-terminal-accent" /> 
                Unique Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-terminal-text">
                {formatNumber(data.uniqueVisitors)}
              </p>
              <p className="text-xs text-terminal-dim mt-1">
                Distinct users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Most Popular Page */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-terminal border-terminal-dim hover:border-terminal-accent transition-colors duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-terminal-text">
                <Award className="h-5 w-5 text-terminal-accent" /> 
                Most Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.pageVisits && Object.keys(data.pageVisits).length > 0 ? (
                <>
                  <p className="text-xl font-bold truncate text-terminal-text">
                    {formatPageName(
                      Object.entries(data.pageVisits)
                        .sort((a, b) => b[1] - a[1])[0][0]
                    )}
                  </p>
                  <p className="text-xs text-terminal-dim mt-1">
                    Most viewed page
                  </p>
                </>
              ) : (
                <p className="text-terminal-dim">No page data yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Activity */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-terminal border-terminal-dim hover:border-terminal-accent transition-colors duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-terminal-text">
                <TrendingUp className="h-5 w-5 text-terminal-accent" /> 
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.visitsByDay && Object.keys(data.visitsByDay).length > 0 ? (
                <>
                  <p className="text-3xl font-bold text-terminal-text">
                    {formatNumber(
                      data.visitsByDay[new Date().toISOString().split('T')[0]] || 0
                    )}
                  </p>
                  <p className="text-xs text-terminal-dim mt-1">
                    Visits today
                  </p>
                </>
              ) : (
                <p className="text-terminal-dim">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="bg-terminal border-terminal-dim mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-terminal-text">
              <BarChart2 className="h-5 w-5 text-terminal-accent" /> 
              Traffic Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {dailyVisitsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyVisitsData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333342" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#e2e8f0" 
                    tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    height={40}
                  />
                  <YAxis 
                    stroke="#e2e8f0" 
                    tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    width={40}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke={COLORS[0]} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-terminal-text">Not enough data to show trends</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="bg-terminal border-terminal-dim">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-terminal-text">
                <Globe className="h-5 w-5 text-terminal-accent" /> 
                Popular Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {pageVisitsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pageVisitsData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 20,
                      left: 30,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333342" />
                    <XAxis 
                      type="number" 
                      stroke="#e2e8f0" 
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#e2e8f0" 
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      width={100} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="visits" 
                      animationDuration={1500}
                      radius={[0, 4, 4, 0]}
                    >
                      {pageVisitsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[0]}
                          fillOpacity={1.0 - (index * 0.15)}
                          stroke="#1c1c28"
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-terminal-text">No page data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="bg-terminal border-terminal-dim">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-terminal-text">
                <Clock className="h-5 w-5 text-terminal-accent" /> 
                Hourly Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {pageVisitsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareHourlyData()}
                    margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333342" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#e2e8f0" 
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      stroke="#e2e8f0" 
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="visits" 
                      fill={COLORS[1]}
                      radius={[4, 4, 0, 0]} 
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-terminal-text">No hourly distribution data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="text-center text-sm text-terminal-text mt-6 p-4 bg-terminal border border-terminal-accent rounded-lg"
      >
        <p className="mb-2 text-terminal-dim">
          Get these stats via terminal:
          <code className="bg-terminal-dim text-terminal-text ml-2 px-2 py-1 rounded">stats --view analytics</code>
        </p>
        <p className="text-xs text-terminal-dim">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;