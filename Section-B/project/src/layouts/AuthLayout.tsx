import { Outlet } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding and info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <ChefHat size={36} />
            <h1 className="text-3xl font-bold">Tastify</h1>
          </div>
          <p className="mt-2 text-primary-100">Discover your unique taste profile with AI</p>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Personalized Recommendations</h2>
            <p className="text-primary-100">Our machine learning algorithm analyzes your preferences to suggest items tailored just for you.</p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Discover New Favorites</h2>
            <p className="text-primary-100">Expand your horizons with recommendations that match your taste profile but introduce you to new experiences.</p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Continuous Learning</h2>
            <p className="text-primary-100">Our system gets smarter with every interaction, constantly refining your taste profile.</p>
          </div>
        </div>
        
        <p className="text-sm text-primary-200">© 2025 Tastify. All rights reserved.</p>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;