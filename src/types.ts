export  type BaseMapType = 
  | 'OpenStreetMap'
  | 'Google Maps'
  | 'Bing Maps'
  | 'ESRI World Imagery';

export interface PhotoData {
  id: string;
  file: File;
  url: string;
  coordinates?: [number, number];
  exif: ExifData;
}

export interface ExifData {
  Make?: string;
  Model?: string;
  DateTime?: string;
  GPSLatitude?: number;
  GPSLongitude?: number;
  ImageWidth?: number;
  ImageHeight?: number;
  ExposureTime?: number;
  FNumber?: number;
  ISO?: number;
  FocalLength?: number;
  [key: string]: any;
}
 