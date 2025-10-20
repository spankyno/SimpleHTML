import  { X } from 'lucide-react';
import { useMap } from '../contexts/MapContext';

export default function PhotoInfo() {
  const { selectedPhoto, setSelectedPhoto } = useMap();

  if (!selectedPhoto) return null;

  const formatCoordinates = (lat?: number | string, lng?: number | string) => {
    if (lat === undefined || lng === undefined) return 'Not available';
    
    // Ensure values are numbers before using toFixed
    const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
    const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
    
    // Check if conversion resulted in valid numbers
    if (isNaN(latNum) || isNaN(lngNum)) return 'Not available';
    
    return `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`;
  };

  return (
    <div className="absolute bottom-4 right-4 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-10">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg truncate">{selectedPhoto.file.name}</h3>
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <img 
          src={selectedPhoto.url} 
          alt="Selected photo" 
          className="w-full h-40 object-cover mb-3 rounded"
        />
        
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Coordinates: </span>
            {selectedPhoto.coordinates ? 
              formatCoordinates(selectedPhoto.coordinates[0], selectedPhoto.coordinates[1]) : 
              formatCoordinates(selectedPhoto.exif.GPSLatitude, selectedPhoto.exif.GPSLongitude)}
          </div>
          
          {selectedPhoto.exif.Make && (
            <div>
              <span className="font-semibold">Camera: </span>
              {selectedPhoto.exif.Make} {selectedPhoto.exif.Model}
            </div>
          )}
          
          {selectedPhoto.exif.DateTime && (
            <div>
              <span className="font-semibold">Date: </span>
              {selectedPhoto.exif.DateTime}
            </div>
          )}
          
          {selectedPhoto.exif.ImageWidth && selectedPhoto.exif.ImageHeight && (
            <div>
              <span className="font-semibold">Resolution: </span>
              {selectedPhoto.exif.ImageWidth} x {selectedPhoto.exif.ImageHeight}
            </div>
          )}
          
          {selectedPhoto.exif.FNumber && (
            <div>
              <span className="font-semibold">Aperture: </span>
              f/{typeof selectedPhoto.exif.FNumber === 'number' ? selectedPhoto.exif.FNumber.toFixed(1) : selectedPhoto.exif.FNumber}
            </div>
          )}
          
          {selectedPhoto.exif.ExposureTime && (
            <div>
              <span className="font-semibold">Exposure: </span>
              {typeof selectedPhoto.exif.ExposureTime === 'number' ? 
                selectedPhoto.exif.ExposureTime.toFixed(4) : 
                selectedPhoto.exif.ExposureTime} sec
            </div>
          )}
          
          {selectedPhoto.exif.ISO && (
            <div>
              <span className="font-semibold">ISO: </span>
              {selectedPhoto.exif.ISO}
            </div>
          )}
          
          {selectedPhoto.exif.FocalLength && (
            <div>
              <span className="font-semibold">Focal Length: </span>
              {typeof selectedPhoto.exif.FocalLength === 'number' ? 
                selectedPhoto.exif.FocalLength.toFixed(1) : 
                selectedPhoto.exif.FocalLength}mm
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 