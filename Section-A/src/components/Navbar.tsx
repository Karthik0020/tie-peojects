import { Link } from 'react-router-dom';
import { ChefHat, Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and menu toggle */}
          <div className="flex items-center">
            <button 
              type="button"
              className="p-2 rounded-md text-gray-500 lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu size={24} />
            </button>
            
            <Link to="/dashboard" className="flex items-center space-x-2 ml-2 lg:ml-0">
              <ChefHat className="text-primary-600" size={28} />
              <span className="text-xl font-bold text-gray-900">Tastify</span>
            </Link>
          </div>
          
          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-500"></span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={16} className="text-primary-700" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={logout}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;