import { ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { useState } from 'react';
import { Recommendation } from '../types/recommendation';

interface RecommendationCardProps {
  item: Recommendation;
  onFeedback: (id: string, liked: boolean) => void;
}

const RecommendationCard = ({ item, onFeedback }: RecommendationCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);
  
  const handleFeedback = (liked: boolean) => {
    setFeedback(liked ? 'liked' : 'disliked');
    onFeedback(item.id, liked);
  };
  
  return (
    <div className="card overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="h-48 -mx-6 -mt-6 mb-4 bg-gray-200 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      {/* Content */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <div className="flex space-x-1 text-xs">
            {item.tags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
        
        {/* Match percentage */}
        <div className="mt-3 flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${item.matchPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium text-primary-700">{item.matchPercentage}%</span>
        </div>
        
        {/* Details (shown conditionally) */}
        {showDetails && (
          <div className="mt-4 space-y-3 animate-fade-in text-sm">
            <h4 className="font-medium">Why we recommended this:</h4>
            <ul className="space-y-1.5">
              {item.reasonsForRecommendation.map((reason, index) => (
                <li key={index} className="flex">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button 
            className="text-sm text-primary-600 flex items-center hover:text-primary-700"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info size={16} className="mr-1" />
            {showDetails ? 'Hide details' : 'Why recommended?'}
          </button>
          
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded-full transition-colors ${
                feedback === 'disliked' 
                  ? 'bg-red-100 text-red-600' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              onClick={() => handleFeedback(false)}
              aria-label="Dislike"
            >
              <ThumbsDown size={18} />
            </button>
            
            <button 
              className={`p-2 rounded-full transition-colors ${
                feedback === 'liked' 
                  ? 'bg-green-100 text-green-600' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              onClick={() => handleFeedback(true)}
              aria-label="Like"
            >
              <ThumbsUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;