import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, ThumbsUp, Compass, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Recommendations', icon: ThumbsUp, href: '/recommendations' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Help', icon: HelpCircle, href: '/help' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  
  // Determine if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar itself - mobile is conditional, desktop is fixed */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile sidebar header with close button */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation links */}
        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive(item.href) 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
              onClick={() => onClose()}
            >
              <item.icon size={18} className={`mr-3 ${isActive(item.href) ? 'text-primary-600' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Pro upgrade banner */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-r from-accent-600 to-accent-500 rounded-lg p-4 text-white">
            <h3 className="font-medium mb-1">Upgrade to Pro</h3>
            <p className="text-xs mb-2 text-accent-100">Get advanced taste analytics and personalization</p>
            <button className="w-full py-2 bg-white text-accent-600 rounded-md text-sm font-medium">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;