import express from 'express';
import * as tf from '@tensorflow/tfjs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// In-memory data stores (would be a database in production)
const users = new Map();
const profiles = new Map();
const items = new Map();
const userFeedback = new Map();

// Load initial dataset and ML model
let model;

// Initialize TensorFlow model
const initializeModel = async () => {
  try {
    // Create a simple collaborative filtering model
    model = tf.sequential();
    
    // Input layer: Features + User embedding
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      inputShape: [20], // 10 taste dimensions + 10 feature embedding
    }));
    
    // Hidden layer
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
    }));
    
    // Output layer (similarity score)
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid',
    }));
    
    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
    });
    
    console.log('ML model initialized successfully');
  } catch (error) {
    console.error('Error initializing ML model:', error);
  }
};

// Initialize data
const initializeData = () => {
  // Sample items data
  const sampleItems = [
    {
      id: uuidv4(),
      name: 'Neapolitan Pizza',
      description: 'Traditional wood-fired pizza with San Marzano tomatoes and fresh mozzarella.',
      features: [2, 7, 3, 2, 8, 1, 7, 6, 8, 3], // taste dimensions
      category: 'italian',
      imageUrl: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
    },
    // ... more items would be added in a real application
  ];
  
  // Store items
  sampleItems.forEach(item => {
    items.set(item.id, item);
  });
  
  console.log(`Initialized ${items.size} items`);
};

// API ROUTES

// User Authentication Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if user already exists
  const existingUser = Array.from(users.values()).find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  // Create new user
  const userId = uuidv4();
  const user = {
    id: userId,
    name,
    email,
    // In a real app, password would be hashed
    passwordHash: password,
    createdAt: new Date().toISOString(),
  };
  
  users.set(userId, user);
  
  // Return user without sensitive data
  const { passwordHash, ...userWithoutPassword } = user;
  return res.status(201).json({
    user: userWithoutPassword,
    token: `mock-token-${userId}`,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = Array.from(users.values()).find(u => u.email === email);
  
  // Validate password (in a real app, would compare hashes)
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Return user without sensitive data
  const { passwordHash, ...userWithoutPassword } = user;
  return res.status(200).json({
    user: userWithoutPassword,
    token: `mock-token-${user.id}`,
  });
});

// Profile Routes
app.get('/api/profiles/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Check if profile exists
  if (!profiles.has(userId)) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  return res.json(profiles.get(userId));
});

app.post('/api/profiles/:userId', (req, res) => {
  const { userId } = req.params;
  const { preferences } = req.body;
  
  if (!preferences) {
    return res.status(400).json({ error: 'Preferences are required' });
  }
  
  // Create or update profile
  const profile = {
    userId,
    preferences,
    updatedAt: new Date().toISOString(),
  };
  
  profiles.set(userId, profile);
  
  return res.status(200).json(profile);
});

// Recommendation Routes
app.get('/api/recommendations/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // Check if user has a profile
  if (!profiles.has(userId)) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  
  const profile = profiles.get(userId);
  
  try {
    // In a real app, this would use the ML model to generate recommendations
    // For now, we'll return mock recommendations
    const recommendations = Array.from(items.values())
      .slice(0, 10)
      .map(item => {
        // Calculate a mock matching score
        const matchScore = Math.random() * 100;
        
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          matchPercentage: Math.round(matchScore),
          category: item.category,
          imageUrl: item.imageUrl,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Feedback Routes
app.post('/api/feedback', (req, res) => {
  const { userId, itemId, liked } = req.body;
  
  if (!userId || !itemId || liked === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Store feedback
  if (!userFeedback.has(userId)) {
    userFeedback.set(userId, []);
  }
  
  const feedback = {
    itemId,
    liked,
    timestamp: new Date().toISOString(),
  };
  
  userFeedback.get(userId).push(feedback);
  
  // In a real app, this would update the ML model
  
  return res.status(200).json({ success: true });
});

// Initialize data and ML model
initializeData();
initializeModel();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});