import { useEffect, useState } from 'react';
import { useTasteProfile } from '../hooks/useTasteProfile';
import RecommendationCard from '../components/RecommendationCard';
import TasteCard from '../components/TasteCard';
import { RefreshCw, Filter, FilterX } from 'lucide-react';

const Recommendations = () => {
  const { profile, recommendations, loading, provideFeedback, fetchRecommendations } = useTasteProfile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minMatchPercentage, setMinMatchPercentage] = useState(0);
  
  useEffect(() => {
    // Fetch initial recommendations if not already loaded
    if (recommendations.length === 0 && !loading) {
      fetchRecommendations();
    }
  }, [recommendations.length, loading, fetchRecommendations]);
  
  // Filter recommendations based on selected filters
  const filteredRecommendations = recommendations.filter(rec => {
    const matchesCategory = selectedCategory === null || 
      rec.tags.includes(selectedCategory);
    
    const matchesPercentage = rec.matchPercentage >= minMatchPercentage;
    
    return matchesCategory && matchesPercentage;
  });
  
  // Get unique categories from recommendations
  const categories = [...new Set(
    recommendations.flatMap(rec => rec.tags)
  )].sort();
  
  // Handle refresh of recommendations
  const handleRefresh = () => {
    fetchRecommendations();
  };
  
  // Reset all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setMinMatchPercentage(0);
  };
  
  // Are any filters currently active?
  const hasActiveFilters = selectedCategory !== null || minMatchPercentage > 0;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="mb-2">Your Recommendations</h1>
        <p className="text-gray-600">
          Personalized suggestions based on your taste profile
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar with taste profile and filters */}
        <div className="lg:col-span-1 space-y-6">
          {profile && <TasteCard profile={profile} />}
          
          {/* Filters card */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-accent-600 flex items-center"
                >
                  <FilterX size={14} className="mr-1" />
                  Clear
                </button>
              )}
            </div>
            
            {/* Match percentage slider */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  Minimum Match
                </label>
                <span className="text-sm font-medium text-primary-600">
                  {minMatchPercentage}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={minMatchPercentage}
                onChange={(e) => setMinMatchPercentage(parseInt(e.target.value, 10))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #7c3aed ${minMatchPercentage}%, #e5e7eb ${minMatchPercentage}%)`
                }}
              />
            </div>
            
            {/* Category filters */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-800 border border-primary-300'
                        : 'bg-gray-100 text-gray-700 border border-transparent hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category ? null : category
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content with recommendations */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {filteredRecommendations.length} Recommendation{filteredRecommendations.length !== 1 ? 's' : ''}
            </h2>
            <button 
              className="btn-outline flex items-center text-sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse-slow text-primary-600">
                Generating recommendations...
              </div>
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <div className="card py-12 text-center">
              <p className="text-gray-600 mb-4">
                {recommendations.length === 0
                  ? "We don't have any recommendations for you yet. Complete your taste profile to get started."
                  : "No recommendations match your current filters."}
              </p>
              {recommendations.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecommendations.map(item => (
                <RecommendationCard
                  key={item.id}
                  item={item}
                  onFeedback={provideFeedback}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;