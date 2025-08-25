import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Award, 
  Activity, 
  Camera,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { db } from '../lib/supabase';
import toast from 'react-hot-toast';

const Home = () => {
  const [recentResults, setRecentResults] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalTeams: 0,
    totalStudents: 0,
    winRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent match results
      const { data: results } = await db.getMatchResults({ limit: 5 });
      setRecentResults(results || []);

      // Fetch upcoming events (you can integrate with Google Calendar API here)
      const upcoming = [
        {
          id: 1,
          title: 'U11A Football vs St. Mary\'s',
          date: '2024-01-15',
          time: '14:00',
          venue: 'Home',
          sport: 'Football'
        },
        {
          id: 2,
          title: 'U13 Rugby Tournament',
          date: '2024-01-18',
          time: '10:00',
          venue: 'Away',
          sport: 'Rugby'
        }
      ];
      setUpcomingEvents(upcoming);

      // Fetch basic stats
      const { data: teams } = await db.getTeams();
      const { data: allResults } = await db.getMatchResults();
      
      const totalMatches = allResults?.length || 0;
      const totalTeams = teams?.length || 0;
      const completedMatches = allResults?.filter(r => r.status === 'completed') || [];
      const wins = completedMatches.filter(r => r.result_type === 'win').length;
      const winRate = completedMatches.length > 0 ? (wins / completedMatches.length * 100).toFixed(1) : 0;

      setStats({
        totalMatches,
        totalTeams,
        totalStudents: 120, // This would come from students table
        winRate: parseFloat(winRate)
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const featureCards = [
    {
      title: 'Match Results',
      description: 'View and manage all match results with comprehensive statistics',
      icon: Trophy,
      href: '/match-results',
      color: 'bg-blue-500'
    },
    {
      title: 'Team Statistics',
      description: 'Analyze team performance with detailed analytics and charts',
      icon: Users,
      href: '/team-stats',
      color: 'bg-green-500'
    },
    {
      title: 'Performance Analytics',
      description: 'Track trends and identify top-performing teams and players',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Results Input',
      description: 'Submit new match results and player performances',
      icon: BookOpen,
      href: '/results-input',
      color: 'bg-orange-500'
    },
    {
      title: 'Team Sheets',
      description: 'Manage team lineups and view upcoming matches',
      icon: Calendar,
      href: '/team-sheets',
      color: 'bg-red-500'
    },
    {
      title: 'Kit Marks',
      description: 'Track equipment and kit management for students',
      icon: Award,
      href: '/kit-marks',
      color: 'bg-indigo-500'
    },
    {
      title: 'PE Groups',
      description: 'Manage physical education groups and activities',
      icon: Activity,
      href: '/pe-groups',
      color: 'bg-pink-500'
    },
    {
      title: 'Camera Upload',
      description: 'Capture and upload sports photos and moments',
      icon: Camera,
      href: '/camera',
      color: 'bg-yellow-500'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex items-center">
            <img
              src="/images/Barrow Hills 284.jpg"
              alt="BHS Sports"
              className="h-24 w-24 rounded-lg object-cover mr-6"
            />
            <div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                BHS Sports Hub
              </h1>
              <p className="mt-2 text-xl text-primary-100">
                Barrow Hills School PE Department central hub for all things sport
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Matches</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalMatches}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Teams</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalTeams}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalStudents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.winRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore the Platform</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  <span className={`inline-flex p-3 rounded-lg ${feature.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Match Results */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Match Results</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentResults.length > 0 ? (
              recentResults.map((result) => (
                <div key={result.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        {result.home_team?.name} vs {result.away_team?.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(result.match_date)}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {result.home_score} - {result.away_score}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-sm text-gray-500">
                No recent match results
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        {event.title}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(event.date)}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.venue}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-sm text-gray-500">
                No upcoming events
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
