import React, { useState, useRef } from 'react';
import { Address } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddressListProps {
  addresses: Address[];
  isOptimized: boolean;
  onRemoveAddress: (id: string) => void;
  onMoveAddress: (fromIndex: number, toIndex: number) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  isOptimized,
  onRemoveAddress,
  onMoveAddress,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onMoveAddress(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch events för mobil
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    setDraggedIndex(index);
    setTouchStartY(e.touches[0].clientY);
    setTouchCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    
    e.preventDefault();
    setTouchCurrentY(e.touches[0].clientY);
    
    // Hitta vilken adress som är under fingret
    const touchY = e.touches[0].clientY;
    const elements = document.elementsFromPoint(e.touches[0].clientX, touchY);
    const addressElement = elements.find(el => el.hasAttribute('data-index'));
    
    if (addressElement) {
      const index = parseInt(addressElement.getAttribute('data-index') || '0');
      setDragOverIndex(index);
    }
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onMoveAddress(draggedIndex, dragOverIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTouchStartY(null);
    setTouchCurrentY(null);
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/60">Inga adresser tillagda än</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {addresses.map((address, index) => (
        <div
          key={address.id}
          ref={index === 0 ? dragRef : null}
          className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${
            isOptimized ? 'border-success border-2' : 'border-base-300'
          } ${draggedIndex === index ? 'dragging opacity-50' : ''} ${
            dragOverIndex === index ? 'drag-over border-primary bg-primary/10' : ''
          }`}
          draggable
          data-index={index}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          onTouchStart={(e) => handleTouchStart(e, index)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="card-body p-2 sm:p-3 lg:p-4">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span className="drag-handle cursor-move text-base-content/60 hover:text-base-content flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                  </svg>
                </span>
                <span className="font-semibold text-base-content/70 w-6 sm:w-8 text-sm sm:text-base flex-shrink-0">
                  {index + 1}.
                </span>
                <span className="text-base-content text-sm sm:text-base truncate min-w-0 flex-1">
                  {address.text}
                </span>
                {isOptimized ? (
                  <div className="badge badge-success gap-1 text-xs sm:text-sm flex-shrink-0">
                    <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="hidden sm:inline">Optimerad</span>
                    <span className="sm:hidden">Opt</span>
                  </div>
                ) : (
                  <div className="badge badge-neutral gap-1 text-xs sm:text-sm flex-shrink-0">
                    <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                    <span className="hidden sm:inline">Manuell</span>
                    <span className="sm:hidden">Man</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemoveAddress(address.id)}
                className="btn btn-ghost btn-xs sm:btn-sm btn-circle text-error hover:bg-error hover:text-error-content flex-shrink-0"
              >
                <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;

