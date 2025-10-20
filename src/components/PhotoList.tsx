import  { useMap } from '../contexts/MapContext';
import { useState, useEffect } from 'react';
import { MapPin, Image, Search, X } from 'lucide-react';

export default function PhotoList() {
  const { photos, setSelectedPhoto, selectedPhoto } = useMap();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState(photos);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPhotos(photos);
    } else {
      const filtered = photos.filter(photo => 
        photo.file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPhotos(filtered);
    }
  }, [photos, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handlePhotoClick = (photo: any) => {
    // Set the selected photo in the map context - this will trigger the zoom in MapController
    setSelectedPhoto(photo);
  };

  return (
    <div className="bg-white w-80 h-full shadow-lg flex flex-col overflow-hidden border-r border-gray-200">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold mb-2 text-gray-700">Photo List ({photos.length})</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search photos..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={handleClearSearch}
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredPhotos.length > 0 ? (
          <ul>
            {filteredPhotos.map(photo => (
              <li 
                key={photo.id}
                className={`p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer flex items-start ${
                  selectedPhoto?.id === photo.id ? 'bg-blue-100' : ''
                }`}
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="mr-3 flex-shrink-0">
                  <div className="relative">
                    <Image size={32} className="text-gray-400" />
                    <MapPin size={12} className="text-blue-600 absolute -bottom-1 -right-1" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={photo.file.name}>
                    {photo.file.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {photo.exif.DateTime || 'No date available'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {photo.coordinates ? 
                      `${photo.coordinates[0].toFixed(4)}, ${photo.coordinates[1].toFixed(4)}` : 
                      'No coordinates'
                    }
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No photos match your search' : 'No photos available'}
          </div>
        )}
      </div>
    </div>
  );
}
 