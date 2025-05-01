import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChefHat, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
        <h1 className="text-2xl font-semibold">Welcome back to Tastify</h1>
        <p className="text-gray-600 mt-2">
          Sign in to access your personalized taste profile
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || authError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error || authError}
          </div>
        )}
        
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
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>
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
        
        <div>
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
              <LogIn size={18} className="mr-2" />
            )}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up now
          </Link>
        </div>
        
        {/* Demo credentials hint */}
        <div className="mt-8 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
          <p className="font-medium mb-1">Demo Credentials</p>
          <p>Email: demo@example.com</p>
          <p>Password: password</p>
        </div>
      </form>
    </div>
  );
};

export default Login;