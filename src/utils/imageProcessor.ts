import  exifr from 'exifr';
import { PhotoData } from '../types';

// Sample geotagged photos with Unsplash images
const SAMPLE_PHOTOS = [
  {
    name: "Paris.jpg",
    url: "https://images.unsplash.com/photo-1577086664693-894d8405334a?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBsb2NhdGlvbnxlbnwwfHx8fDE3NDI4MTY4OTh8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
    coordinates: [48.8566, 2.3522],
    exif: {
      Make: "Canon",
      Model: "EOS 5D Mark IV",
      DateTime: "2023-05-15 14:30:22",
      ImageWidth: 5472,
      ImageHeight: 3648,
      FNumber: 2.8,
      ExposureTime: 1/250,
      ISO: 100,
      FocalLength: 24
    }
  },
  {
    name: "London.jpg",
    url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBsb2NhdGlvbnxlbnwwfHx8fDE3NDI4MTY4OTh8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
    coordinates: [51.5074, -0.1278],
    exif: {
      Make: "Nikon",
      Model: "Z7 II",
      DateTime: "2023-06-22 16:45:11",
      ImageWidth: 4256,
      ImageHeight: 2832,
      FNumber: 4.0,
      ExposureTime: 1/125,
      ISO: 200,
      FocalLength: 35
    }
  },
  {
    name: "Rome.jpg",
    url: "https://images.unsplash.com/photo-1520299607509-dcd935f9a839?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBsb2NhdGlvbnxlbnwwfHx8fDE3NDI4MTY4OTh8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
    coordinates: [41.9028, 12.4964],
    exif: {
      Make: "Sony",
      Model: "Alpha A7R IV",
      DateTime: "2023-04-10 11:15:30",
      ImageWidth: 6000,
      ImageHeight: 4000,
      FNumber: 5.6,
      ExposureTime: 1/160,
      ISO: 400,
      FocalLength: 50
    }
  },
  {
    name: "Barcelona.jpg",
    url: "https://images.unsplash.com/photo-1488628176578-4ffd5fdbc900?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBsb2NhdGlvbnxlbnwwfHx8fDE3NDI4MTY4OTh8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
    coordinates: [41.3851, 2.1734],
    exif: {
      Make: "Fujifilm",
      Model: "X-T4",
      DateTime: "2023-07-05 10:20:15",
      ImageWidth: 5120,
      ImageHeight: 3420,
      FNumber: 8.0,
      ExposureTime: 1/500,
      ISO: 250,
      FocalLength: 18
    }
  }
];

export async function processImages(fileList: FileList): Promise<PhotoData[]> {
  const files = Array.from(fileList).filter(file => 
    file.type.startsWith('image/')
  );
  
  const processedFiles: PhotoData[] = [];
  
  // Check if we have real files or if we should use sample data
  if (files.length === 0 || files[0].size === 0) {
    // No real files, return sample data
    SAMPLE_PHOTOS.forEach((sample, index) => {
      // Create a file blob for the sample
      const sampleBlob = new Blob(['sample image content'], { type: 'image/jpeg' });
      const sampleFile = new File([sampleBlob], sample.name, { type: 'image/jpeg' });
      
      processedFiles.push({
        id: `sample-${index}-${Date.now()}`,
        file: sampleFile,
        url: sample.url,
        coordinates: sample.coordinates as [number, number],
        exif: {
          Make: sample.exif.Make,
          Model: sample.exif.Model,
          DateTime: sample.exif.DateTime,
          GPSLatitude: sample.coordinates[0],
          GPSLongitude: sample.coordinates[1],
          ImageWidth: sample.exif.ImageWidth,
          ImageHeight: sample.exif.ImageHeight,
          ExposureTime: sample.exif.ExposureTime,
          FNumber: sample.exif.FNumber,
          ISO: sample.exif.ISO,
          FocalLength: sample.exif.FocalLength
        }
      });
    });
    
    return processedFiles;
  }
  
  // Process actual files if there are any real ones
  for (const file of files) {
    try {
      // Skip files with no content
      if (file.size === 0) continue;
      
      // Parse EXIF data
      const exifData = await exifr.parse(file, {
        gps: true,
        tiff: true,
        exif: true,
      });
      
      if (!exifData) continue;
      
      // Only include files with GPS coordinates
      if (exifData.latitude && exifData.longitude) {
        const url = URL.createObjectURL(file);
        
        processedFiles.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          url,
          coordinates: [exifData.latitude, exifData.longitude],
          exif: {
            Make: exifData.Make,
            Model: exifData.Model,
            DateTime: exifData.DateTimeOriginal ? formatDate(exifData.DateTimeOriginal) : undefined,
            GPSLatitude: exifData.latitude,
            GPSLongitude: exifData.longitude,
            ImageWidth: exifData.ImageWidth,
            ImageHeight: exifData.ImageHeight,
            ExposureTime: exifData.ExposureTime,
            FNumber: exifData.FNumber,
            ISO: exifData.ISO,
            FocalLength: exifData.FocalLength,
            ...exifData
          }
        });
      }
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }
  
  // If we didn't find any geotagged photos in the real files, use sample data
  if (processedFiles.length === 0) {
    // Return sample data
    SAMPLE_PHOTOS.forEach((sample, index) => {
      const sampleBlob = new Blob(['sample image content'], { type: 'image/jpeg' });
      const sampleFile = new File([sampleBlob], sample.name, { type: 'image/jpeg' });
      
      processedFiles.push({
        id: `sample-${index}-${Date.now()}`,
        file: sampleFile,
        url: sample.url,
        coordinates: sample.coordinates as [number, number],
        exif: {
          Make: sample.exif.Make,
          Model: sample.exif.Model,
          DateTime: sample.exif.DateTime,
          GPSLatitude: sample.coordinates[0],
          GPSLongitude: sample.coordinates[1],
          ImageWidth: sample.exif.ImageWidth,
          ImageHeight: sample.exif.ImageHeight,
          ExposureTime: sample.exif.ExposureTime,
          FNumber: sample.exif.FNumber,
          ISO: sample.exif.ISO,
          FocalLength: sample.exif.FocalLength
        }
      });
    });
  }
  
  return processedFiles;
}

function formatDate(date: Date): string {
  if (!date || !(date instanceof Date)) return '';
  return date.toLocaleString();
}
 