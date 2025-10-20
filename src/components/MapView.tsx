import  { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap as useLeafletMap, Tooltip } from 'react-leaflet';
import { Icon, LatLngBounds, latLngBounds } from 'leaflet';
import { useMap } from '../contexts/MapContext';
import PhotoInfo from './PhotoInfo';

// Map controller component for programmatically controlling the map
function MapController({ photos, selectedPhoto }: { photos: any[], selectedPhoto: any }) {
  const map = useLeafletMap();
  
  // Auto-zoom to fit all markers when photos change
  useEffect(() => {
    if (photos.length > 0 && photos.some(p => p.coordinates)) {
      const bounds = new LatLngBounds([]);
      
      photos.forEach(photo => {
        if (photo.coordinates) {
          bounds.extend(photo.coordinates);
        }
      });
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12
        });
      }
    }
  }, [photos, map]);
  
  // Zoom to selected photo with maximum zoom level when a photo is selected
  useEffect(() => {
    if (selectedPhoto?.coordinates) {
      map.setView(selectedPhoto.coordinates, 18, {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedPhoto, map]);
  
  return null;
}

export default function MapView() {
  const { photos, selectedPhoto, setSelectedPhoto, baseMap } = useMap();
  const mapRef = useRef<any>(null);
  const [showLabels, setShowLabels] = useState(true);

  const getBaseMap = () => {
    switch (baseMap) {
      case 'OpenStreetMap':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'Google Maps':
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      case 'Bing Maps':
        return 'https://tiles.bing.net/tiles/microsoft.imagery/{z}/{x}/{y}.jpeg?g=14364';
      case 'ESRI World Imagery':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getMapAttribution = () => {
    switch (baseMap) {
      case 'OpenStreetMap':
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      case 'Google Maps':
        return '&copy; Google Maps';
      case 'Bing Maps':
        return '&copy; Microsoft';
      case 'ESRI World Imagery':
        return '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and others';
      default:
        return '';
    }
  };

  const customIcon = new Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getSubdomains = () => {
    if (baseMap === 'Google Maps') {
      return ['mt0', 'mt1', 'mt2', 'mt3'];
    }
    return 'abc';
  };

  // Filter out photos without coordinates
  const filteredPhotos = photos.filter(photo => photo.coordinates);

  return (
    <div className="map-container flex-1">
      <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded shadow-md">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="showLabels" 
            checked={showLabels} 
            onChange={() => setShowLabels(!showLabels)}
            className="mr-2"
          />
          <label htmlFor="showLabels" className="text-sm">Show photo labels</label>
        </div>
      </div>
      
      <MapContainer
        center={[40, -3]} 
        zoom={3}
        ref={mapRef}
        className="h-full"
        zoomControl={false} // Disable default zoom control
      >
        {/* Reposition zoom control to the right side */}
        <div className="leaflet-control-container">
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control-zoom leaflet-bar leaflet-control mt-10">
              <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in"
                onClick={(e) => {
                  e.preventDefault();
                  if (mapRef.current) {
                    mapRef.current.zoomIn();
                  }
                }}>+</a>
              <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out"
                onClick={(e) => {
                  e.preventDefault();
                  if (mapRef.current) {
                    mapRef.current.zoomOut();
                  }
                }}>−</a>
            </div>
          </div>
        </div>
        
        <TileLayer
          attribution={getMapAttribution()}
          url={getBaseMap()}
          subdomains={getSubdomains()}
        />
        
        {filteredPhotos.map(photo => (
          <Marker
            key={photo.id}
            position={photo.coordinates!}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                setSelectedPhoto(photo);
              }
            }}
          >
            {showLabels && (
              <Tooltip direction="top" offset={[0, -40]} permanent>
                <span className="text-xs font-medium">{photo.file.name}</span>
              </Tooltip>
            )}
            <Popup maxWidth={300}>
              <div className="flex flex-col items-center">
                <img src={photo.url} alt={photo.file.name} className="photo-preview max-w-full max-h-40 object-contain" />
                <h3 className="mt-2 font-semibold text-sm">{photo.file.name}</h3>
                <button 
                  className="mt-2 text-blue-600 hover:underline text-sm"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapController photos={filteredPhotos} selectedPhoto={selectedPhoto} />
      </MapContainer>

      {selectedPhoto && <PhotoInfo />}
    </div>
  );
}
 