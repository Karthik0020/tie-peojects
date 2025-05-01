import { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { TasteProfile } from '../types/tasteProfile';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface TasteCardProps {
  profile: TasteProfile;
}

const TasteCard = ({ profile }: TasteCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Extract taste dimensions for chart
  const dimensions = Object.keys(profile.dimensions);
  const values = Object.values(profile.dimensions);
  
  // Chart data configuration
  const chartData = {
    labels: dimensions.map(dim => dim.charAt(0).toUpperCase() + dim.slice(1)),
    datasets: [
      {
        label: 'Your Taste Profile',
        data: values,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(124, 58, 237, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(124, 58, 237, 1)',
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
          stepSize: 2,
          backdropColor: 'transparent',
        },
      },
    },
  };
  
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Your Taste Profile</h3>
          <p className="text-sm text-gray-500">
            Last updated {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
          {profile.confidence}% Match
        </span>
      </div>
      
      <div className="h-64">
        <Radar data={chartData} options={chartOptions} />
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <h4 className="font-medium">Key Insights</h4>
          <ul className="space-y-2">
            {profile.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button 
        className="w-full mt-4 text-sm text-primary-600 font-medium hover:text-primary-700"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

export default TasteCard;