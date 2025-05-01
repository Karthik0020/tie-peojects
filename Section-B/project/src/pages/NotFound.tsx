import { Link } from 'react-router-dom';
import { ChefHat, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-primary-100 rounded-full">
            <ChefHat size={48} className="text-primary-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. The recipe might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center px-6 py-3"
        >
          <Home size={18} className="mr-2" />
          Return Home
        </Link>
      </div>
      <div className="mt-16 text-center">
        <h3 className="text-lg font-medium mb-3">Looking for recommendations?</h3>
        <div className="flex justify-center space-x-4">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
            Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/recommendations" className="text-primary-600 hover:text-primary-700 font-medium">
            Recommendations
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium">
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;