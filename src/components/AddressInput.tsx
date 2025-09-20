import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddressInputProps {
  onAddAddress: (address: string) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ onAddAddress }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddAddress(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input input-bordered input-sm sm:input-md lg:input-lg w-full text-sm sm:text-base"
          placeholder="Ange adress (t.ex. Storgatan 1, Stockholm)"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-sm sm:btn-md lg:btn-lg w-full sm:w-auto"
      >
        <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Lägg till adress</span>
        <span className="sm:hidden">Lägg till</span>
      </button>
    </form>
  );
};

export default AddressInput;

