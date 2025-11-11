import React, { useState } from 'react';
import { PRESET_COLORS, BackgroundColor } from '../types';

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorChange,
  disabled = false,
}) => {
  const [customColor, setCustomColor] = useState('#ffffff');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handleColorSelect = (color: BackgroundColor) => {
    if (color.id === 'custom') {
      setShowCustomPicker(true);
      onColorChange(customColor);
    } else {
      setShowCustomPicker(false);
      onColorChange(color.value);
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onColorChange(newColor);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Background Color</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PRESET_COLORS.map((color) => {
          const isSelected =
            color.id === 'custom'
              ? showCustomPicker
              : selectedColor === color.value;

          return (
            <button
              key={color.id}
              onClick={() => handleColorSelect(color)}
              disabled={disabled}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
                ${disabled ? 'cursor-not-allowed' : 'hover:border-blue-400 hover:shadow-md'}
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`
                    w-12 h-12 rounded-lg border-2 border-gray-200 shadow-inner
                    ${color.value === 'transparent' ? 'bg-transparent' : ''}
                  `}
                  style={{
                    backgroundColor: color.value === 'transparent' ? 'transparent' : color.value,
                    backgroundImage: color.value === 'transparent'
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                      : 'none',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                  }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {color.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Color Picker */}
      {showCustomPicker && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Custom Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              disabled={disabled}
              className="h-12 w-20 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                onColorChange(e.target.value);
              }}
              disabled={disabled}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
