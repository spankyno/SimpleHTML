import  { useCallback, useState } from 'react';
import { useMap } from '../contexts/MapContext';
import { X, Upload, AlertTriangle, Info } from 'lucide-react';
import { processImages } from '../utils/imageProcessor';

interface UploadOverlayProps {
  onClose: () => void;
}

export default function UploadOverlay({ onClose }: UploadOverlayProps) {
  const { setPhotos } = useMap();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discardedCount, setDiscardedCount] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    setIsProcessing(true);
    setError(null);
    setDiscardedCount(0);
    
    try {
      const totalImageCount = Array.from(fileList).filter(file => 
        file.type.startsWith('image/')
      ).length;
      
      const results = await processImages(fileList);
      
      if (results.length === 0) {
        setError("None of the selected files contain GPS coordinates. Please select geotagged images.");
      } else {
        const discarded = totalImageCount - results.length;
        setDiscardedCount(discarded);
        setPhotos(results);
        
        // If at least one image was processed successfully, close the modal
        if (results.length > 0) {
          setTimeout(() => {
            onClose();
          }, discarded > 0 ? 1500 : 500); // Give user time to see the discarded message if needed
        }
      }
    } catch (err) {
      setError(`Error processing images: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upload Geotagged Photos</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your photos here, or
            </p>
            <div className="mt-3">
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                <span>Browse Files</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  disabled={isProcessing}
                />
              </label>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Only geotagged images (JPG, PNG, etc.) will be displayed on the map.
              Photos without GPS information will be discarded.
            </p>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          
          {discardedCount > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md flex items-center">
              <Info className="mr-2 h-5 w-5" />
              <span>{discardedCount} image{discardedCount !== 1 ? 's' : ''} without GPS data {discardedCount !== 1 ? 'were' : 'was'} discarded.</span>
            </div>
          )}
          
          {isProcessing && (
            <div className="mt-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Processing images...</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-5 py-3 rounded-b-lg">
          <p className="text-xs text-gray-500">
            We'll extract GPS data from your photos to display them on the map. Your photos are processed locally and not uploaded to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
 