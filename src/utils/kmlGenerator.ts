import  { PhotoData } from '../types';

export function generateKML(photos: PhotoData[]): string {
  // KML Header
  let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Georef Photos by Aitor</name>
    <description>Geotagged photos collection</description>
    <Style id="photoMarker">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>`;

  // Add placemarks for each photo
  photos.forEach(photo => {
    if (!photo.coordinates) return;
    
    const [lat, lng] = photo.coordinates;
    const description = `
      <![CDATA[
        <div>
          <img src="${photo.url}" alt="${photo.file.name}" style="max-width:200px;max-height:200px;margin-bottom:10px;" />
          <p><strong>File:</strong> ${photo.file.name}</p>
          ${photo.exif.DateTime ? `<p><strong>Date:</strong> ${photo.exif.DateTime}</p>` : ''}
          ${photo.exif.Make ? `<p><strong>Camera:</strong> ${photo.exif.Make} ${photo.exif.Model || ''}</p>` : ''}
        </div>
      ]]>
    `;

    kml += `
    <Placemark>
      <name>${photo.file.name}</name>
      <description>${description}</description>
      <styleUrl>#photoMarker</styleUrl>
      <Point>
        <coordinates>${lng},${lat}</coordinates>
      </Point>
    </Placemark>`;
  });

  // KML Footer
  kml += `
  </Document>
</kml>`;

  return kml;
}
 