import { useState } from 'react';

interface PreferenceSliderProps {
  name: string;
  label: string;
  min?: number;
  max?: number;
  initialValue?: number;
  onChange: (name: string, value: number) => void;
}

const PreferenceSlider = ({
  name,
  label,
  min = 0,
  max = 10,
  initialValue = 5,
  onChange,
}: PreferenceSliderProps) => {
  const [value, setValue] = useState(initialValue);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    onChange(name, newValue);
  };
  
  // Calculate background gradient for slider
  const percentage = ((value - min) / (max - min)) * 100;
  const background = `linear-gradient(to right, #7c3aed ${percentage}%, #e5e7eb ${percentage}%)`;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm font-medium text-primary-600">{value}</span>
      </div>
      
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{ background }}
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Not at all</span>
        <span>Extremely</span>
      </div>
    </div>
  );
};

export default PreferenceSlider;