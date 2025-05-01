import { useState, useEffect } from 'react';
import { useTasteProfile } from '../hooks/useTasteProfile';
import { Recommendation } from '../types/recommendation';
import RecommendationCard from '../components/RecommendationCard';
import { Search, FilterX, Filter } from 'lucide-react';
import { api } from '../lib/api';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'italian', name: 'Italian' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'mexican', name: 'Mexican' },
  { id: 'indian', name: 'Indian' },
  { id: 'thai', name: 'Thai' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'american', name: 'American' },
  { id: 'french', name: 'French' },
  { id: 'korean', name: 'Korean' },
];

const Explore = () => {
  const { provideFeedback } = useTasteProfile();
  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchExploreItems = async () => {
      try {
        setLoading(true);
        // This would normally fetch from your backend's explore endpoint
        const exploreItems = await api.explore.getItems();
        setItems(exploreItems);
      } catch (err) {
        console.error('Error fetching explore items:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExploreItems();
  }, []);
  
  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      item.tags.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle feedback for exploration items
  const handleFeedback = async (id: string, liked: boolean) => {
    await provideFeedback(id, liked);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="mb-2">Explore New Tastes</h1>
        <p className="text-gray-600">
          Discover new flavors and expand your taste profile
        </p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, description, or tag..."
            className="input pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <Filter size={16} className="mr-1" />
            Filters
          </button>
          
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={resetFilters}
              className="btn-outline flex items-center text-accent-600 border-accent-300 hover:bg-accent-50"
            >
              <FilterX size={16} className="mr-1" />
              Reset
            </button>
          )}
        </div>
      </div>
      
      {/* Category Filters - shown conditionally */}
      {showFilters && (
        <div className="card py-4 animate-slide-up">
          <h3 className="font-medium mb-3 px-4">Filter by Cuisine</h3>
          <div className="flex flex-wrap gap-2 px-4">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results section */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse-slow text-primary-600">
            Discovering new tastes...
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-600 mb-2">No items match your search criteria</p>
          <button
            onClick={resetFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <RecommendationCard
              key={item.id}
              item={item}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;