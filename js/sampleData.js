//  Sample geotagged photos with Unsplash images
const SAMPLE_PHOTOS = [
  {
    name: "Paris.jpg",
    url: "https://images.unsplash.com/photo-1577086664693-894d8405334a?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBjYW1lcmF8ZW58MHx8fHwxNzQyODkyNzE0fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
    url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBjYW1lcmF8ZW58MHx8fHwxNzQyODkyNzE0fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
    name: "Barcelona.jpg",
    url: "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBjYW1lcmF8ZW58MHx8fHwxNzQyODkyNzE0fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
  },
  {
    name: "Rome.jpg",
    url: "https://images.unsplash.com/photo-1457608135803-4827addc43e0?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxnZW90YWdnZWQlMjBwaG90b3MlMjBtYXAlMjBjYW1lcmF8ZW58MHx8fHwxNzQyODkyNzE0fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
  }
];
 