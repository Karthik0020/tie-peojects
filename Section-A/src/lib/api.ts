import { User } from '../types/user';
import { TasteProfile } from '../types/tasteProfile';
import { Recommendation } from '../types/recommendation';
import { v4 as uuidv4 } from 'uuid';

// Demo data for simulating API responses
const DEMO_USERS: Record<string, User> = {
  '1': { id: '1', name: 'Demo User', email: 'demo@example.com' },
};

// Mock storage for user profiles
const USER_PROFILES: Record<string, TasteProfile> = {};

// Mock item database with taste dimensions for recommendation model
const ITEMS_DATABASE: Recommendation[] = [
  // Italian items
  {
    id: '101',
    name: 'Authentic Neapolitan Pizza',
    description: 'Traditional wood-fired pizza with San Marzano tomatoes and fresh mozzarella.',
    imageUrl: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['italian', 'pizza'],
    reasonsForRecommendation: [],
  },
  {
    id: '102',
    name: 'Truffle Risotto',
    description: 'Creamy arborio rice with fresh truffle shavings and aged parmesan.',
    imageUrl: 'https://images.pexels.com/photos/6542709/pexels-photo-6542709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['italian', 'rice'],
    reasonsForRecommendation: [],
  },
  // Japanese items
  {
    id: '201',
    name: 'Otoro Sushi',
    description: 'Premium fatty tuna belly sushi with a melt-in-your-mouth texture.',
    imageUrl: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['japanese', 'seafood'],
    reasonsForRecommendation: [],
  },
  {
    id: '202',
    name: 'Tonkotsu Ramen',
    description: 'Rich pork bone broth with thin noodles, chashu pork, and ajitama egg.',
    imageUrl: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['japanese', 'noodles'],
    reasonsForRecommendation: [],
  },
  // Mexican items
  {
    id: '301',
    name: 'Street Tacos Al Pastor',
    description: 'Marinated pork tacos with pineapple, cilantro, and onion on corn tortillas.',
    imageUrl: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['mexican', 'street food'],
    reasonsForRecommendation: [],
  },
  {
    id: '302',
    name: 'Mole Poblano',
    description: 'Complex sauce with chocolate, chiles, and spices served over chicken.',
    imageUrl: 'https://images.pexels.com/photos/5966041/pexels-photo-5966041.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['mexican', 'chicken'],
    reasonsForRecommendation: [],
  },
  // Indian items
  {
    id: '401',
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich tomato, butter, and cream sauce with aromatic spices.',
    imageUrl: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['indian', 'curry'],
    reasonsForRecommendation: [],
  },
  {
    id: '402',
    name: 'Masala Dosa',
    description: 'Crispy fermented rice crepe filled with spiced potatoes and served with chutneys.',
    imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['indian', 'vegetarian'],
    reasonsForRecommendation: [],
  },
  // Thai items
  {
    id: '501',
    name: 'Tom Yum Goong',
    description: 'Hot and sour shrimp soup with lemongrass, lime leaves, and chili.',
    imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['thai', 'soup'],
    reasonsForRecommendation: [],
  },
  {
    id: '502',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts, and lime.',
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchPercentage: 0,
    tags: ['thai', 'noodles'],
    reasonsForRecommendation: [],
  },
];

// Item feature vectors for ML model (simplified for demonstration)
const ITEM_FEATURES: Record<string, number[]> = {
  // Format: [sweet, salty, sour, bitter, umami, spicy, texture, aroma, visual, novelty]
  '101': [2, 7, 3, 2, 8, 1, 7, 6, 8, 3],  // Neapolitan Pizza
  '102': [1, 6, 1, 2, 9, 0, 8, 7, 7, 5],  // Truffle Risotto
  '201': [1, 5, 2, 0, 9, 0, 9, 5, 8, 7],  // Otoro Sushi
  '202': [1, 7, 2, 1, 9, 3, 8, 8, 7, 4],  // Tonkotsu Ramen
  '301': [2, 5, 3, 1, 7, 6, 6, 7, 7, 4],  // Tacos Al Pastor
  '302': [4, 3, 2, 5, 8, 7, 5, 8, 6, 8],  // Mole Poblano
  '401': [3, 4, 1, 0, 7, 5, 6, 8, 7, 3],  // Butter Chicken
  '402': [1, 4, 2, 1, 6, 4, 8, 6, 7, 6],  // Masala Dosa
  '501': [1, 3, 9, 1, 7, 8, 4, 9, 6, 7],  // Tom Yum Goong
  '502': [3, 5, 4, 0, 6, 4, 7, 6, 7, 4],  // Pad Thai
};

// Simulate delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate cosine similarity between two vectors
 */
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Convert user preferences to a feature vector for the ML model
 */
const preferencesToVector = (preferences: Record<string, number>): number[] => {
  const dimensions = [
    'sweet', 'salty', 'sour', 'bitter', 'umami', 
    'spicy', 'texture', 'aroma', 'visual', 'novelty'
  ];
  
  return dimensions.map(dim => preferences[dim] || 5);
};

/**
 * Generate reasons for recommendation based on user preferences and item features
 */
const generateReasons = (
  userPreferences: Record<string, number>,
  itemId: string,
  similarity: number
): string[] => {
  const reasons: string[] = [];
  const dimensions = [
    { id: 'sweet', name: 'sweetness' },
    { id: 'salty', name: 'saltiness' },
    { id: 'sour', name: 'sourness' },
    { id: 'bitter', name: 'bitterness' },
    { id: 'umami', name: 'umami' },
    { id: 'spicy', name: 'spiciness' },
    { id: 'texture', name: 'texture' },
    { id: 'aroma', name: 'aroma' },
    { id: 'visual', name: 'visual presentation' },
    { id: 'novelty', name: 'novelty' },
  ];
  
  // Get item features
  const itemFeatures = ITEM_FEATURES[itemId];
  
  // Find the top 3 matching dimensions
  const matches = dimensions.map((dim, index) => {
    const userValue = userPreferences[dim.id] || 5;
    const itemValue = itemFeatures[index];
    const difference = Math.abs(userValue - itemValue);
    
    return { 
      dimension: dim.name, 
      match: 10 - difference,
      userValue,
      itemValue
    };
  }).sort((a, b) => b.match - a.match).slice(0, 3);
  
  // Generate reasons based on matches
  matches.forEach(match => {
    if (match.match >= 8) {
      if (match.userValue >= 7 && match.itemValue >= 7) {
        reasons.push(`This item's ${match.dimension} perfectly matches your preference for high ${match.dimension}.`);
      } else if (match.userValue <= 3 && match.itemValue <= 3) {
        reasons.push(`This item's low ${match.dimension} aligns well with your preference.`);
      } else {
        reasons.push(`The ${match.dimension} profile of this item is a good match for your preferences.`);
      }
    }
  });
  
  // Add overall match reason
  if (similarity >= 0.9) {
    reasons.push("This is an exceptional match for your overall taste profile.");
  } else if (similarity >= 0.8) {
    reasons.push("This aligns very well with your general taste preferences.");
  } else if (similarity >= 0.7) {
    reasons.push("This is a good overall match for your taste profile.");
  }
  
  // Add preference for specific categories if relevant
  const item = ITEMS_DATABASE.find(i => i.id === itemId);
  if (item) {
    const categoryPreferences = userPreferences.categories as unknown as string[];
    if (Array.isArray(categoryPreferences)) {
      for (const category of item.tags) {
        if (categoryPreferences.includes(category)) {
          reasons.push(`You've indicated a preference for ${category} cuisine.`);
          break;
        }
      }
    }
  }
  
  return reasons.slice(0, 4);  // Limit to 4 reasons max
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(1000);
      
      // Demo login - in a real app, validate credentials against backend
      if (email === 'demo@example.com' && password === 'password') {
        return { 
          user: DEMO_USERS['1'], 
          token: 'demo-token' 
        };
      }
      
      throw new Error('Invalid credentials');
    },
    
    register: async (name: string, email: string, password: string) => {
      await delay(1000);
      
      // Demo registration - in a real app, create user in database
      const userId = uuidv4();
      const newUser: User = { id: userId, name, email };
      
      // Store in our demo user database
      DEMO_USERS[userId] = newUser;
      
      return { 
        user: newUser, 
        token: 'demo-token' 
      };
    },
  },
  
  profile: {
    get: async (userId: string): Promise<TasteProfile> => {
      await delay(500);
      
      if (USER_PROFILES[userId]) {
        return USER_PROFILES[userId];
      }
      
      throw new Error('Profile not found');
    },
    
    update: async (userId: string, preferences: Record<string, any>): Promise<TasteProfile> => {
      await delay(1500);
      
      // Create a taste profile from preferences
      const dimensionKeys = [
        'sweet', 'salty', 'sour', 'bitter', 'umami', 
        'spicy', 'texture', 'aroma', 'visual', 'novelty'
      ];
      
      const dimensions: Record<string, number> = {};
      
      // Extract relevant dimensions
      dimensionKeys.forEach(key => {
        if (typeof preferences[key] === 'number') {
          dimensions[key] = preferences[key];
        } else {
          dimensions[key] = 5; // Default value
        }
      });
      
      // Generate insights based on preferences
      const insights: string[] = [];
      
      const highValues = Object.entries(dimensions)
        .filter(([_, value]) => value >= 8)
        .map(([key, _]) => key);
      
      const lowValues = Object.entries(dimensions)
        .filter(([_, value]) => value <= 2)
        .map(([key, _]) => key);
      
      if (highValues.length > 0) {
        insights.push(`You have a strong preference for ${highValues.join(', ')} flavors and experiences.`);
      }
      
      if (lowValues.length > 0) {
        insights.push(`You tend to avoid ${lowValues.join(', ')} flavors and experiences.`);
      }
      
      if (dimensions.novelty >= 7) {
        insights.push('You enjoy exploring new and unfamiliar tastes.');
      } else if (dimensions.novelty <= 3) {
        insights.push('You prefer familiar tastes that you know you\'ll enjoy.');
      }
      
      if (dimensions.texture >= dimensions.aroma && dimensions.texture >= dimensions.visual) {
        insights.push('Texture is more important to your experience than aroma or visual presentation.');
      } else if (dimensions.aroma >= dimensions.texture && dimensions.aroma >= dimensions.visual) {
        insights.push('Aroma plays a crucial role in your enjoyment of food.');
      } else {
        insights.push('Visual presentation significantly impacts your dining experience.');
      }
      
      // Create profile object
      const profile: TasteProfile = {
        userId,
        dimensions,
        insights,
        confidence: Math.round(75 + Math.random() * 20), // Random between 75-95%
        dataPoints: Math.floor(10 + Math.random() * 40), // Random between 10-50
        updatedAt: new Date().toISOString(),
      };
      
      // Save profile
      USER_PROFILES[userId] = profile;
      
      return profile;
    },
  },
  
  recommendations: {
    get: async (userId: string): Promise<Recommendation[]> => {
      await delay(1200);
      
      // Check if user has a profile
      if (!USER_PROFILES[userId]) {
        return [];
      }
      
      const profile = USER_PROFILES[userId];
      const userVector = preferencesToVector(profile.dimensions);
      
      // Calculate match scores for all items
      const recommendations = ITEMS_DATABASE.map(item => {
        const itemFeatures = ITEM_FEATURES[item.id];
        if (!itemFeatures) return { ...item, matchPercentage: 0 };
        
        // Calculate similarity score
        const similarity = cosineSimilarity(userVector, itemFeatures);
        const matchPercentage = Math.round(similarity * 100);
        
        // Generate reasons for recommendation
        const reasons = generateReasons(profile.dimensions, item.id, similarity);
        
        return {
          ...item,
          matchPercentage,
          reasonsForRecommendation: reasons,
        };
      });
      
      // Sort by match percentage and return top items
      return recommendations
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 8);
    },
  },
  
  feedback: {
    provide: async (userId: string, itemId: string, liked: boolean) => {
      await delay(800);
      
      // In a real app, this would store feedback and update the ML model
      console.log(`User ${userId} ${liked ? 'liked' : 'disliked'} item ${itemId}`);
      
      return { success: true };
    },
  },
  
  explore: {
    getItems: async (): Promise<Recommendation[]> => {
      await delay(1000);
      
      // In a real app, this would fetch diverse items for exploration
      // For demo, return all items with randomized match percentages
      return ITEMS_DATABASE.map(item => {
        // Generate random match percentage for explore items
        const matchPercentage = Math.floor(50 + Math.random() * 40); // 50-90%
        
        // Random reasons for exploration
        const reasons = [
          "This will help expand your taste profile.",
          "Try something new to refine your preferences.",
          "This has flavors you don't usually experience.",
          "This is popular among users with similar tastes.",
        ];
        
        return {
          ...item,
          matchPercentage,
          reasonsForRecommendation: [
            reasons[Math.floor(Math.random() * reasons.length)],
            reasons[Math.floor(Math.random() * reasons.length)],
          ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
        };
      });
    },
  },
};