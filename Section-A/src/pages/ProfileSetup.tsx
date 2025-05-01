import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasteProfile } from '../hooks/useTasteProfile';
import PreferenceSlider from '../components/PreferenceSlider';
import { ChefHat, Save } from 'lucide-react';

// Taste dimensions for our ML model
const TASTE_DIMENSIONS = [
  { name: 'sweet', label: 'Sweet' },
  { name: 'salty', label: 'Salty' },
  { name: 'sour', label: 'Sour' },
  { name: 'bitter', label: 'Bitter' },
  { name: 'umami', label: 'Umami' },
  { name: 'spicy', label: 'Spicy' },
  { name: 'texture', label: 'Texture Preference' },
  { name: 'aroma', label: 'Aroma Importance' },
  { name: 'visual', label: 'Visual Presentation' },
  { name: 'novelty', label: 'Openness to New Foods' },
];

// Food categories for preference selection
const FOOD_CATEGORIES = [
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

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { updatePreferences, loading } = useTasteProfile();
  
  // State for taste dimension preferences
  const [preferences, setPreferences] = useState<Record<string, number>>(
    TASTE_DIMENSIONS.reduce((acc, { name }) => ({ ...acc, [name]: 5 }), {})
  );
  
  // State for food category preferences
  const [categoryPreferences, setCategoryPreferences] = useState<string[]>([]);
  
  // Handle dimension slider changes
  const handlePreferenceChange = (name: string, value: number) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle food category toggles
  const toggleCategory = (categoryId: string) => {
    setCategoryPreferences(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Submit preferences to backend/ML model
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Combine dimension preferences with category preferences
      const allPreferences = {
        ...preferences,
        categories: categoryPreferences
      };
      
      await updatePreferences(allPreferences);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-100 rounded-full">
            <ChefHat size={36} className="text-primary-700" />
          </div>
        </div>
        <h1>Build Your Taste Profile</h1>
        <p className="text-gray-600 mt-2">
          Help us understand your preferences to create personalized recommendations
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Taste Dimension Preferences */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Your Taste Dimensions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TASTE_DIMENSIONS.map(({ name, label }) => (
              <PreferenceSlider
                key={name}
                name={name}
                label={label}
                initialValue={preferences[name]}
                onChange={handlePreferenceChange}
              />
            ))}
          </div>
        </div>
        
        {/* Food Category Preferences */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Cuisine Preferences</h2>
          <p className="text-gray-600 mb-4">
            Select cuisines you enjoy (select at least 3)
          </p>
          
          <div className="flex flex-wrap gap-3">
            {FOOD_CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${categoryPreferences.includes(category.id)
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                  }`}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || categoryPreferences.length < 3}
            className={`btn-primary flex items-center px-6 py-3 text-lg
              ${loading || categoryPreferences.length < 3 ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Processing...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Create My Taste Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;