import  { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PhotoData, BaseMapType } from '../types';
import { processImages } from '../utils/imageProcessor';

interface MapContextType {
  photos: PhotoData[];
  setPhotos: (photos: PhotoData[]) => void;
  selectedPhoto: PhotoData | null;
  setSelectedPhoto: (photo: PhotoData | null) => void;
  baseMap: BaseMapType;
  setBaseMap: (type: BaseMapType) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [baseMap, setBaseMap] = useState<BaseMapType>('OpenStreetMap');
  
  // Load sample data on first render
  useEffect(() => {
    const loadSampleData = async () => {
      try {
        // Create a minimal FileList-like object to trigger sample data
        const fileList = {
          0: new File([''], 'sample.jpg', { type: 'image/jpeg' }),
          length: 1,
          item: (index: number) => index === 0 ? new File([''], 'sample.jpg', { type: 'image/jpeg' }) : null
        } as unknown as FileList;
        
        const samplePhotos = await processImages(fileList);
        setPhotos(samplePhotos);
      } catch (error) {
        console.error("Error loading sample data:", error);
      }
    };
    
    loadSampleData();
  }, []);

  return (
    <MapContext.Provider value={{ 
      photos, 
      setPhotos, 
      selectedPhoto, 
      setSelectedPhoto,
      baseMap,
      setBaseMap
    }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
 