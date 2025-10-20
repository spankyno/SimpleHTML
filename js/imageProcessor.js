/**
  * Process images and extract EXIF data including GPS coordinates
 */
class ImageProcessor {
  constructor() {
    this.photos = [];
  }
  
  /**
   * Process a list of files and extract EXIF data
   */
  async processImages(fileList) {
    const files = Array.from(fileList).filter(file => 
      file.type.startsWith('image/')
    );
    
    const processedFiles = [];
    
    // Check if we have real files or if we should use sample data
    if (files.length === 0 || files[0].size === 0) {
      // Return sample data
      return this.loadSamplePhotos();
    }
    
    // Process actual files
    for (const file of files) {
      try {
        // Skip files with no content
        if (file.size === 0) continue;
        
        // Parse EXIF data
        const exifData = await window.exifr.parse(file, {
          gps: true,
          tiff: true,
          exif: true,
        });
        
        if (!exifData) continue;
        
        // Only include files with GPS coordinates
        if (exifData.latitude && exifData.longitude) {
          const url = URL.createObjectURL(file);
          
          processedFiles.push({
            id: generateId(),
            file: file,
            name: file.name,
            url: url,
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
        throw new Error(`Error processing file ${file.name}: ${error.message}`);
      }
    }
    
    // If we didn't find any geotagged photos in the real files, use sample data
    if (processedFiles.length === 0) {
      return this.loadSamplePhotos();
    }
    
    return processedFiles;
  }
  
  /**
   * Load sample photos data
   */
  loadSamplePhotos() {
    return SAMPLE_PHOTOS.map((sample, index) => ({
      id: `sample-${index}-${Date.now()}`,
      name: sample.name,
      url: sample.url,
      coordinates: sample.coordinates,
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
    }));
  }
}
 