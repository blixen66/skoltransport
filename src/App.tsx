import React, { useState, useEffect } from 'react';
import { useAddresses } from './hooks/useAddresses';
import { useSavedRoutes } from './hooks/useSavedRoutes';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useAlerts } from './hooks/useAlerts';
import AddressInput from './components/AddressInput';
import AddressList from './components/AddressList';
import SavedRoutesList from './components/SavedRoutesList';
import LoadingSpinner from './components/LoadingSpinner';
import AlertContainer from './components/AlertContainer';
import { 
  MapIcon, 
  TrashIcon, 
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

function App() {
  const {
    addresses,
    isOptimized,
    addAddress,
    removeAddress,
    clearAllAddresses,
    moveAddress,
    setOptimizedAddresses,
    loadAddresses,
  } = useAddresses();

  const {
    savedRoutes,
    loading: routesLoading,
    saveRoute,
    loadRoute,
    deleteRoute,
    loadSavedRoutes,
  } = useSavedRoutes();

  const {
    isLoaded: mapsLoaded,
    loading: mapsLoading,
    error: mapsError,
    optimizeRoute,
    generateGoogleMapsUrl,
  } = useGoogleMaps();

  const { alerts, showAlert, removeAlert } = useAlerts();

  const [routeName, setRouteName] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Visa Google Maps API-status
  useEffect(() => {
    if (mapsError) {
      showAlert(`Google Maps API fel: ${mapsError}`, 'danger');
    } else if (mapsLoaded) {
      showAlert('Google Maps API laddad framgångsrikt!', 'success');
    }
  }, [mapsLoaded, mapsError, showAlert]);

  const handleOptimizeRoute = async () => {
    if (addresses.length < 2) {
      showAlert('Du behöver minst 2 adresser för att optimera', 'warning');
      return;
    }

    try {
      const addressTexts = addresses.map(addr => addr.text);
      const result = await optimizeRoute(addressTexts);
      
      if (result.isOptimized) {
        setOptimizedAddresses(result.addresses);
        showAlert('✅ Rutt optimerad framgångsrikt med Google Maps! Du kan nu justera ordningen manuellt med drag-and-drop.', 'success');
      } else {
        showAlert('ℹ️ Rutt optimerad med Google Maps. Ordningen var redan optimal. Du kan ändra ordningen manuellt med drag-and-drop.', 'info');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel vid optimering';
      showAlert(`Fel vid optimering: ${errorMessage}`, 'danger');
    }
  };

  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
      showAlert('Ange ett namn på rutten', 'warning');
      return;
    }

    if (addresses.length === 0) {
      showAlert('Inga adresser att spara', 'warning');
      return;
    }

    try {
      const addressTexts = addresses.map(addr => addr.text);
      await saveRoute(routeName.trim(), addressTexts);
      setRouteName('');
      showAlert('Rutt sparad framgångsrikt!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel vid sparande';
      showAlert(`Fel vid sparande: ${errorMessage}`, 'danger');
    }
  };

  const handleLoadRoute = async (routeId: number) => {
    try {
      const route = await loadRoute(routeId);
      loadAddresses(route.addresses);
      showAlert(`Rutt "${route.name}" laddad!`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel vid laddning';
      showAlert(`Fel vid laddning: ${errorMessage}`, 'danger');
    }
  };

  const handleDeleteRoute = async (routeId: number, routeName: string) => {
    try {
      await deleteRoute(routeId, routeName);
      showAlert(`Rutt "${routeName}" borttagen!`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel vid borttagning';
      showAlert(`Fel vid borttagning: ${errorMessage}`, 'danger');
    }
  };

  const handleOpenInGoogleMaps = () => {
    if (addresses.length < 2) {
      showAlert('Du behöver minst 2 adresser för att öppna i Google Maps', 'warning');
      return;
    }

    const addressTexts = addresses.map(addr => addr.text);
    const url = generateGoogleMapsUrl(addressTexts);
    setGoogleMapsUrl(url);
    window.open(url, '_blank');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(googleMapsUrl);
      showAlert('Länk kopierad till urklipp!', 'success');
    } catch (error) {
      showAlert('Kunde inte kopiera länk', 'danger');
    }
  };

  const handleMoveAddress = (fromIndex: number, toIndex: number) => {
    moveAddress(fromIndex, toIndex);
    showAlert('Adresser omordnade manuellt. Klicka "Optimera rutt" för att optimera med Google Maps igen.', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary py-2 px-2 sm:py-4 sm:px-4 lg:py-8 lg:px-4" data-theme="skoltransporter">
      <div className="max-w-6xl mx-auto">
        <div className="card bg-base-100 shadow-2xl">
          {/* Huvudrubrik */}
          <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content">
            <div className="hero-content text-center py-4 sm:py-8 lg:py-12">
              <div className="max-w-md">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <span className="text-center">Skoltransporter</span>
                </h1>
              </div>
            </div>
          </div>
          
          <div className="card-body p-2 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Adresshantering */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-3 sm:p-4 lg:p-6">
                <h2 className="card-title text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">
                  <MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Adresser
                </h2>
                
                <AddressInput onAddAddress={addAddress} />
                
                <AddressList
                  addresses={addresses}
                  isOptimized={isOptimized}
                  onRemoveAddress={removeAddress}
                  onMoveAddress={handleMoveAddress}
                />
                
                <div className="card-actions justify-center">
                  <button
                    onClick={clearAllAddresses}
                    className="btn btn-outline btn-error btn-sm sm:btn-md w-full sm:w-auto"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Rensa alla adresser
                  </button>
                </div>
              </div>
            </div>

            {/* Sorteringsalternativ */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-3 sm:p-4 lg:p-6">
                <h2 className="card-title text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">
                  <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                  Sorteringsalternativ
                </h2>
                
                <div className="alert alert-info mb-4 sm:mb-6">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Google Maps Integration</h3>
                    <div className="text-xs sm:text-sm">Optimerad rutt använder Google Maps API för att beräkna den kortaste vägen mellan adresserna baserat på faktiska avstånd och trafikförhållanden.</div>
                  </div>
                </div>
                
                <div className="alert alert-success mb-4 sm:mb-6">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Arbetsflöde</h3>
                    <div className="text-xs sm:text-sm">
                      <ol className="list-decimal list-inside space-y-1">
                        <li><strong>Klicka "Optimera rutt"</strong> för att optimera med Google Maps</li>
                        <li><strong>Dra och släpp</strong> adresserna för att justera ordningen manuellt</li>
                        <li><strong>Klicka "Optimera rutt" igen</strong> om du vill optimera på nytt</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div className="card-actions justify-center">
                  <button
                    onClick={handleOptimizeRoute}
                    disabled={!mapsLoaded || mapsLoading || addresses.length < 2}
                    className="btn btn-success btn-sm sm:btn-md lg:btn-lg w-full sm:w-auto"
                  >
                    <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    <span className="hidden sm:inline">
                      {mapsLoading ? 'Laddar Google Maps...' : 
                       mapsError ? 'Google Maps fel' : 
                       'Optimera rutt med Google Maps'}
                    </span>
                    <span className="sm:hidden">
                      {mapsLoading ? 'Laddar...' : 
                       mapsError ? 'Fel' : 
                       'Optimera rutt'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Google Maps länk */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-3 sm:p-4 lg:p-6">
                <h2 className="card-title text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">
                  <MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Öppna i Google Maps
                </h2>
                
                <div className="card-actions justify-center mb-4">
                  <button
                    onClick={handleOpenInGoogleMaps}
                    disabled={addresses.length < 2}
                    className="btn btn-primary btn-sm sm:btn-md lg:btn-lg w-full sm:w-auto"
                  >
                    <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    <span className="hidden sm:inline">Öppna i Google Maps</span>
                    <span className="sm:hidden">Öppna i Maps</span>
                  </button>
                </div>
                
                {googleMapsUrl && (
                  <div>
                    <label className="label">
                      <span className="label-text text-sm sm:text-base">Google Maps länk:</span>
                    </label>
                    <div className="join w-full">
                      <input
                        type="text"
                        value={googleMapsUrl}
                        className="input input-bordered input-sm sm:input-md join-item flex-1 text-xs sm:text-sm"
                        readOnly
                      />
                      <button
                        onClick={handleCopyToClipboard}
                        className="btn btn-outline btn-sm sm:btn-md join-item"
                      >
                        <ClipboardDocumentIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Kopiera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Spara rutter */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-3 sm:p-4 lg:p-6">
                <h2 className="card-title text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">
                  <DocumentArrowDownIcon className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                  Spara rutter
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={routeName}
                      onChange={(e) => setRouteName(e.target.value)}
                      className="input input-bordered input-sm sm:input-md w-full text-sm sm:text-base"
                      placeholder="Ange namn på rutten (t.ex. Morgonrutt 1)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveRoute}
                      className="btn btn-success btn-sm sm:btn-md flex-1 sm:flex-none"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Spara rutt</span>
                      <span className="sm:hidden">Spara</span>
                    </button>
                    <button
                      onClick={loadSavedRoutes}
                      className="btn btn-outline btn-info btn-sm sm:btn-md"
                      title="Ladda om rutter från databasen"
                    >
                      <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <DocumentArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Sparade rutter
                </h3>
                <SavedRoutesList
                  savedRoutes={savedRoutes}
                  onLoadRoute={handleLoadRoute}
                  onDeleteRoute={handleDeleteRoute}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading spinner */}
      <LoadingSpinner isVisible={mapsLoading} />

      {/* Alert container */}
      <AlertContainer alerts={alerts} onRemoveAlert={removeAlert} />
    </div>
  );
}

export default App;