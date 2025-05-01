import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTasteProfile } from '../hooks/useTasteProfile';
import { useAuth } from '../hooks/useAuth';
import TasteCard from '../components/TasteCard';
import RecommendationCard from '../components/RecommendationCard';
import { TrendingUp, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    profile, 
    recommendations, 
    loading, 
    hasProfile, 
    fetchRecommendations,
    provideFeedback 
  } = useTasteProfile();
  
  useEffect(() => {
    if (hasProfile) {
      fetchRecommendations();
    }
  }, [hasProfile, fetchRecommendations]);
  
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse-slow text-primary-600">Loading your dashboard...</div>
      </div>
    );
  }
  
  // If no profile yet, show the profile setup prompt
  if (!hasProfile) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center py-12 px-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
          <AlertCircle size={48} className="mx-auto text-primary-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Tastify!</h1>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            We need to understand your preferences to create your personalized taste profile.
          </p>
          <Link to="/profile-setup" className="btn-primary inline-flex items-center">
            Build Your Taste Profile <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's the latest on your taste profile and recommendations.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Taste Confidence</h3>
            <TrendingUp size={18} className="text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-primary-700">{profile?.confidence}%</p>
          <p className="text-sm text-gray-600 mt-1">Based on {profile?.dataPoints || 0} data points</p>
        </div>
        
        <div className="card bg-gradient-to-br from-secondary-50 to-secondary-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Recommendations</h3>
            <TrendingUp size={18} className="text-secondary-600" />
          </div>
          <p className="text-3xl font-bold text-secondary-700">{recommendations.length}</p>
          <p className="text-sm text-gray-600 mt-1">New items to explore</p>
        </div>
        
        <div className="card bg-gradient-to-br from-accent-50 to-accent-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Taste Evolution</h3>
            <TrendingUp size={18} className="text-accent-600" />
          </div>
          <p className="text-3xl font-bold text-accent-700">+12%</p>
          <p className="text-sm text-gray-600 mt-1">Improvement since last month</p>
        </div>
      </div>
      
      {/* Taste Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {profile && <TasteCard profile={profile} />}
        </div>
        
        {/* Top Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Recommendations</h2>
            <button 
              className="btn-outline flex items-center text-sm"
              onClick={() => fetchRecommendations()}
            >
              <RefreshCw size={14} className="mr-1" />
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((item) => (
              <RecommendationCard 
                key={item.id} 
                item={item} 
                onFeedback={provideFeedback} 
              />
            ))}
          </div>
          
          {recommendations.length > 0 && (
            <div className="mt-4 text-center">
              <Link 
                to="/recommendations" 
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                View All Recommendations <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;