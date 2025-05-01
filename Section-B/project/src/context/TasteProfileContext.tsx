import { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { TasteProfile } from '../types/tasteProfile';
import { Recommendation } from '../types/recommendation';
import { api } from '../lib/api';

interface TasteProfileContextType {
  profile: TasteProfile | null;
  recommendations: Recommendation[];
  loading: boolean;
  hasProfile: boolean;
  updatePreferences: (preferences: Record<string, number>) => Promise<void>;
  provideFeedback: (itemId: string, liked: boolean) => Promise<void>;
  fetchRecommendations: () => Promise<void>;
}

export const TasteProfileContext = createContext<TasteProfileContextType>({
  profile: null,
  recommendations: [],
  loading: false,
  hasProfile: false,
  updatePreferences: async () => {},
  provideFeedback: async () => {},
  fetchRecommendations: async () => {},
});

export const TasteProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch user's taste profile when they authenticate
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        const fetchedProfile = await api.profile.get(user.id);
        setProfile(fetchedProfile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // If no profile exists, that's okay - user will need to create one
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [isAuthenticated, user]);
  
  // Update user preferences and recalculate taste profile
  const updatePreferences = useCallback(async (preferences: Record<string, number>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Send preferences to API and get updated profile
      const updatedProfile = await api.profile.update(user.id, preferences);
      setProfile(updatedProfile);
      
      // Get fresh recommendations based on new profile
      const newRecommendations = await api.recommendations.get(user.id);
      setRecommendations(newRecommendations);
      
      return updatedProfile;
    } catch (err) {
      console.error('Failed to update preferences:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Provide feedback on recommendations to improve future results
  const provideFeedback = useCallback(async (itemId: string, liked: boolean) => {
    if (!user) return;
    
    try {
      await api.feedback.provide(user.id, itemId, liked);
      
      // Optionally refresh recommendations after feedback
      const newRecommendations = await api.recommendations.get(user.id);
      setRecommendations(newRecommendations);
    } catch (err) {
      console.error('Failed to provide feedback:', err);
    }
  }, [user]);
  
  // Fetch recommendations based on current profile
  const fetchRecommendations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedRecommendations = await api.recommendations.get(user.id);
      setRecommendations(fetchedRecommendations);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const hasProfile = useMemo(() => Boolean(profile), [profile]);
  
  const value = useMemo(() => ({
    profile,
    recommendations,
    loading,
    hasProfile,
    updatePreferences,
    provideFeedback,
    fetchRecommendations,
  }), [
    profile, 
    recommendations, 
    loading, 
    hasProfile, 
    updatePreferences, 
    provideFeedback, 
    fetchRecommendations
  ]);
  
  return (
    <TasteProfileContext.Provider value={value}>
      {children}
    </TasteProfileContext.Provider>
  );
};