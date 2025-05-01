import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChefHat, UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
      navigate('/profile-setup');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary-100 rounded-full">
            <ChefHat size={28} className="text-primary-700" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Create your Tastify account</h1>
        <p className="text-gray-600 mt-2">
          Join us to discover your unique taste profile
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {(error || authError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error || authError}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="input"
            placeholder="Your Name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="your@email.com"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full flex justify-center items-center
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <span className="animate-spin mr-2">⟳</span>
            ) : (
              <UserPlus size={18} className="mr-2" />
            )}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;