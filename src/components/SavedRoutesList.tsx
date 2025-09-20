import React from 'react';
import { SavedRoute } from '../types';
import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface SavedRoutesListProps {
  savedRoutes: SavedRoute[];
  onLoadRoute: (routeId: number) => void;
  onDeleteRoute: (routeId: number, routeName: string) => void;
}

const SavedRoutesList: React.FC<SavedRoutesListProps> = ({
  savedRoutes,
  onLoadRoute,
  onDeleteRoute,
}) => {
  if (savedRoutes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/60">Inga sparade rutter än</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {savedRoutes.map(route => (
        <div key={route.id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="card-body p-2 sm:p-3 lg:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-base-content mb-1 text-sm sm:text-base truncate">
                  {route.name}
                </h5>
                <p className="text-xs sm:text-sm text-base-content/70">
                  {route.addresses.length} adresser • 
                  Sparad {new Date(route.updated_at).toLocaleDateString('sv-SE')}
                </p>
              </div>
              <div className="flex gap-2 justify-end sm:justify-start">
                <button
                  onClick={() => onLoadRoute(route.id)}
                  className="btn btn-primary btn-xs sm:btn-sm flex-1 sm:flex-none"
                >
                  <ArrowDownTrayIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Ladda</span>
                  <span className="sm:hidden">Ladda</span>
                </button>
                <button
                  onClick={() => onDeleteRoute(route.id, route.name)}
                  className="btn btn-error btn-xs sm:btn-sm"
                >
                  <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedRoutesList;

