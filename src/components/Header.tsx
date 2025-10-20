import  { Camera, Download, MapPin, Layers, List } from 'lucide-react';
import { useMap } from '../contexts/MapContext';
import { BaseMapType } from '../types';
import { generateKML } from '../utils/kmlGenerator';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onUploadClick: () => void;
  onToggleSidebar: () => void;
  showSidebar: boolean;
}

export default function Header({ onUploadClick, onToggleSidebar, showSidebar }: HeaderProps) {
  const { photos, baseMap, setBaseMap } = useMap();
  const [showMapOptions, setShowMapOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMapOptions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleMapTypeChange = (type: BaseMapType) => {
    setBaseMap(type);
    setShowMapOptions(false);
  };

  const handleDownloadKML = () => {
    if (photos.length === 0) return;
    
    const kmlContent = generateKML(photos);
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'georef_photos.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Camera className="h-6 w-6" />
          <h1 className="text-xl font-bold">Georef photos by Aitor</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-blue-700"
            title={showSidebar ? "Hide photo list" : "Show photo list"}
          >
            <List size={20} />
            <span className="hidden sm:inline">Photo List</span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowMapOptions(!showMapOptions)}
              className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-blue-700"
            >
              <Layers size={20} />
              <span className="hidden sm:inline">Map: {baseMap}</span>
              <span className="sm:hidden">Map</span>
            </button>
            
            {showMapOptions && (
              <div className="absolute right-0 mt-1 bg-white text-gray-800 shadow-lg rounded-md overflow-hidden z-50 w-48">
                {['OpenStreetMap', 'Google Maps', 'Bing Maps', 'ESRI World Imagery'].map((type) => (
                  <button
                    key={type}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleMapTypeChange(type as BaseMapType)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={onUploadClick}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-green-500 hover:bg-green-600"
          >
            <MapPin size={20} />
            <span className="hidden sm:inline">Add Photos</span>
            <span className="sm:hidden">Add</span>
          </button>
          
          <button 
            onClick={handleDownloadKML}
            className={`flex items-center space-x-1 px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 ${photos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={photos.length === 0}
          >
            <Download size={20} />
            <span className="hidden sm:inline">Export KML</span>
            <span className="sm:hidden">KML</span>
          </button>
        </div>
      </div>
    </header>
  );
}
 