import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Trophy, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  X,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { db } from '../lib/supabase';
import toast from 'react-hot-toast';

const Admin = () => {
  const { userProfile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  // Check if user is admin
  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'teams':
          const teams = await db.getTeams();
          setData({ teams: teams || [] });
          break;
        case 'sports':
          const sports = await db.getSports();
          setData({ sports: sports || [] });
          break;
        case 'match-results':
          const results = await db.getMatchResults();
          setData({ results: results || [] });
          break;
        case 'users':
          // This would require admin privileges
          setData({ users: [] });
          break;
        default:
          // Dashboard overview
          const overview = await fetchOverviewData();
          setData(overview);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverviewData = async () => {
    try {
      const [teams, sports, results] = await Promise.all([
        db.getTeams(),
        db.getSports(),
        db.getMatchResults()
      ]);

      return {
        totalTeams: teams?.length || 0,
        totalSports: sports?.length || 0,
        totalResults: results?.length || 0,
        recentActivity: results?.slice(0, 5) || []
      };
    } catch (error) {
      throw error;
    }
  };

  const handleCreate = async (type) => {
    try {
      setLoading(true);
      
      switch (type) {
        case 'team':
          await db.createTeam(formData);
          toast.success('Team created successfully');
          break;
        case 'sport':
          // Add sport creation logic
          toast.success('Sport created successfully');
          break;
        case 'match-result':
          await db.createMatchResult(formData);
          toast.success('Match result created successfully');
          break;
        default:
          toast.error('Unknown type');
      }
      
      setShowForm(false);
      setFormData({});
      fetchAdminData();
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type, id) => {
    try {
      setLoading(true);
      
      switch (type) {
        case 'team':
          await db.updateTeam(id, formData);
          toast.success('Team updated successfully');
          break;
        case 'sport':
          // Add sport update logic
          toast.success('Sport updated successfully');
          break;
        case 'match-result':
          await db.updateMatchResult(id, formData);
          toast.success('Match result updated successfully');
          break;
        default:
          toast.error('Unknown type');
      }
      
      setEditingItem(null);
      setFormData({});
      fetchAdminData();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setLoading(true);
      
      switch (type) {
        case 'team':
          // Add team deletion logic
          toast.success('Team deleted successfully');
          break;
        case 'sport':
          // Add sport deletion logic
          toast.success('Sport deleted successfully');
          break;
        case 'match-result':
          await db.deleteMatchResult(id);
          toast.success('Match result deleted successfully');
          break;
        default:
          toast.error('Unknown type');
      }
      
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Settings },
    { id: 'teams', name: 'Teams', icon: Users },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'match-results', name: 'Match Results', icon: Trophy },
    { id: 'users', name: 'Users', icon: Users }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Teams</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.totalTeams || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sports</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.totalSports || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Results</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.totalResults || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {data.recentActivity?.map((activity, index) => (
            <div key={index} className="px-6 py-4">
              <div className="text-sm text-gray-900">
                {activity.home_team?.name} vs {activity.away_team?.name}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(activity.match_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Manage Teams</h2>
        <button
          onClick={() => {
            setFormData({});
            setShowForm('team');
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {data.teams?.map((team) => (
            <li key={team.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {team.logo_url ? (
                      <img className="h-10 w-10 rounded-full" src={team.logo_url} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{team.name}</div>
                    <div className="text-sm text-gray-500">{team.year_group}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(team);
                      setFormData(team);
                      setShowForm('team');
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('team', team.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderSports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Manage Sports</h2>
        <button
          onClick={() => {
            setFormData({});
            setShowForm('sport');
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sport
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {data.sports?.map((sport) => (
            <li key={sport.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{sport.icon}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{sport.name}</div>
                    <div className="text-sm text-gray-500">{sport.description}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(sport);
                      setFormData(sport);
                      setShowForm('sport');
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('sport', sport.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderMatchResults = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Manage Match Results</h2>
        <button
          onClick={() => {
            setFormData({});
            setShowForm('match-result');
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Result
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {data.results?.map((result) => (
            <li key={result.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {result.home_team?.name} vs {result.away_team?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(result.match_date).toLocaleDateString()} - {result.venue}
                  </div>
                  <div className="text-sm text-gray-500">
                    Score: {result.home_score} - {result.away_score}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(result);
                      setFormData(result);
                      setShowForm('match-result');
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('match-result', result.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderForm = () => {
    if (!showForm) return null;

    const isEditing = !!editingItem;
    const title = isEditing ? `Edit ${showForm}` : `Add New ${showForm}`;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setFormData({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (isEditing) {
                handleUpdate(showForm, editingItem.id);
              } else {
                handleCreate(showForm);
              }
            }}>
              {showForm === 'team' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Team Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Year Group</label>
                    <input
                      type="text"
                      value={formData.year_group || ''}
                      onChange={(e) => setFormData({ ...formData, year_group: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>
              )}

              {showForm === 'sport' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Sport Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Icon</label>
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="🏉"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setFormData({});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 inline mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'teams' && renderTeams()}
          {activeTab === 'sports' && renderSports()}
          {activeTab === 'match-results' && renderMatchResults()}
          {activeTab === 'users' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">User management features coming soon.</p>
            </div>
          )}
        </>
      )}

      {renderForm()}
    </div>
  );
};

export default Admin;
