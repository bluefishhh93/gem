import React from 'react';
import { Input } from "@/components/ui/input";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isInteger?: boolean;
  min?: number;
  max?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  isInteger = false, 
  min = 0, 
  max = Number.MAX_SAFE_INTEGER,
  onChange,
  ...props 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isInteger && (e.key === '.' || e.key === 'e')) {
      e.preventDefault();
    }
    if (e.key === '-' && min >= 0) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-numeric characters (except '.' for floats)
    value = isInteger ? value.replace(/[^\d-]/g, '') : value.replace(/[^\d.-]/g, '');
    
    let numValue = isInteger ? parseInt(value, 10) : parseFloat(value);
    
    if (isNaN(numValue)) {
      numValue = min;
    } else {
      numValue = Math.max(min, Math.min(max, numValue));
    }

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: numValue.toString()
      }
    };

    onChange?.(newEvent);
  };

  return (
    <Input
      type="number"
      step={isInteger ? "1" : "any"}
      min={min}
      max={max}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...props}
    />
  );
};

export default NumberInput;