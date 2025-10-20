/**
  * Manage the photo info panel
 */
class PhotoInfo {
  constructor() {
    this.infoElement = document.getElementById('photo-info');
    this.selectedPhoto = null;
  }
  
  /**
   * Show the photo info panel for a selected photo
   */
  showPhotoInfo(photo) {
    if (!photo) return;
    
    this.selectedPhoto = photo;
    
    // Create photo info content
    const content = this.createPhotoInfoContent(photo);
    
    // Update info element
    this.infoElement.innerHTML = '';
    this.infoElement.appendChild(content);
    this.infoElement.classList.remove('hidden');
    
    // Add close handler
    const closeButton = this.infoElement.querySelector('.close-btn');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.hidePhotoInfo();
      });
    }
  }
  
  /**
   * Hide the photo info panel
   */
  hidePhotoInfo() {
    this.selectedPhoto = null;
    this.infoElement.classList.add('hidden');
    this.infoElement.innerHTML = '';
  }
  
  /**
   * Create the photo info content
   */
  createPhotoInfoContent(photo) {
    const fragment = document.createDocumentFragment();
    
    // Header
    const header = document.createElement('div');
    header.className = 'photo-info-header';
    
    const title = document.createElement('h3');
    title.className = 'photo-info-title';
    title.textContent = photo.name;
    title.setAttribute('title', photo.name);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Image preview
    const img = document.createElement('img');
    img.className = 'photo-preview';
    img.src = photo.url;
    img.alt = photo.name;
    
    // Metadata
    const metadata = document.createElement('div');
    metadata.className = 'photo-metadata';
    
    // Coordinates
    const coordsItem = document.createElement('div');
    coordsItem.className = 'metadata-item';
    
    const coordsLabel = document.createElement('span');
    coordsLabel.className = 'metadata-label';
    coordsLabel.textContent = 'Coordinates: ';
    
    const coordsValue = document.createElement('span');
    if (photo.coordinates) {
      coordsValue.textContent = formatCoordinates(photo.coordinates[0], photo.coordinates[1]);
    } else if (photo.exif.GPSLatitude && photo.exif.GPSLongitude) {
      coordsValue.textContent = formatCoordinates(photo.exif.GPSLatitude, photo.exif.GPSLongitude);
    } else {
      coordsValue.textContent = 'Not available';
    }
    
    coordsItem.appendChild(coordsLabel);
    coordsItem.appendChild(coordsValue);
    metadata.appendChild(coordsItem);
    
    // Camera
    if (photo.exif.Make) {
      const cameraItem = document.createElement('div');
      cameraItem.className = 'metadata-item';
      
      const cameraLabel = document.createElement('span');
      cameraLabel.className = 'metadata-label';
      cameraLabel.textContent = 'Camera: ';
      
      const cameraValue = document.createElement('span');
      cameraValue.textContent = `${photo.exif.Make} ${photo.exif.Model || ''}`;
      
      cameraItem.appendChild(cameraLabel);
      cameraItem.appendChild(cameraValue);
      metadata.appendChild(cameraItem);
    }
    
    // Date
    if (photo.exif.DateTime) {
      const dateItem = document.createElement('div');
      dateItem.className = 'metadata-item';
      
      const dateLabel = document.createElement('span');
      dateLabel.className = 'metadata-label';
      dateLabel.textContent = 'Date: ';
      
      const dateValue = document.createElement('span');
      dateValue.textContent = photo.exif.DateTime;
      
      dateItem.appendChild(dateLabel);
      dateItem.appendChild(dateValue);
      metadata.appendChild(dateItem);
    }
    
    // Resolution
    if (photo.exif.ImageWidth && photo.exif.ImageHeight) {
      const resolutionItem = document.createElement('div');
      resolutionItem.className = 'metadata-item';
      
      const resolutionLabel = document.createElement('span');
      resolutionLabel.className = 'metadata-label';
      resolutionLabel.textContent = 'Resolution: ';
      
      const resolutionValue = document.createElement('span');
      resolutionValue.textContent = `${photo.exif.ImageWidth} x ${photo.exif.ImageHeight}`;
      
      resolutionItem.appendChild(resolutionLabel);
      resolutionItem.appendChild(resolutionValue);
      metadata.appendChild(resolutionItem);
    }
    
    // Aperture
    if (photo.exif.FNumber) {
      const apertureItem = document.createElement('div');
      apertureItem.className = 'metadata-item';
      
      const apertureLabel = document.createElement('span');
      apertureLabel.className = 'metadata-label';
      apertureLabel.textContent = 'Aperture: ';
      
      const apertureValue = document.createElement('span');
      apertureValue.textContent = `f/${typeof photo.exif.FNumber === 'number' ? photo.exif.FNumber.toFixed(1) : photo.exif.FNumber}`;
      
      apertureItem.appendChild(apertureLabel);
      apertureItem.appendChild(apertureValue);
      metadata.appendChild(apertureItem);
    }
    
    // Exposure
    if (photo.exif.ExposureTime) {
      const exposureItem = document.createElement('div');
      exposureItem.className = 'metadata-item';
      
      const exposureLabel = document.createElement('span');
      exposureLabel.className = 'metadata-label';
      exposureLabel.textContent = 'Exposure: ';
      
      const exposureValue = document.createElement('span');
      exposureValue.textContent = `${typeof photo.exif.ExposureTime === 'number' ? 
        photo.exif.ExposureTime.toFixed(4) : 
        photo.exif.ExposureTime} sec`;
      
      exposureItem.appendChild(exposureLabel);
      exposureItem.appendChild(exposureValue);
      metadata.appendChild(exposureItem);
    }
    
    // ISO
    if (photo.exif.ISO) {
      const isoItem = document.createElement('div');
      isoItem.className = 'metadata-item';
      
      const isoLabel = document.createElement('span');
      isoLabel.className = 'metadata-label';
      isoLabel.textContent = 'ISO: ';
      
      const isoValue = document.createElement('span');
      isoValue.textContent = photo.exif.ISO;
      
      isoItem.appendChild(isoLabel);
      isoItem.appendChild(isoValue);
      metadata.appendChild(isoItem);
    }
    
    // Focal Length
    if (photo.exif.FocalLength) {
      const focalLengthItem = document.createElement('div');
      focalLengthItem.className = 'metadata-item';
      
      const focalLengthLabel = document.createElement('span');
      focalLengthLabel.className = 'metadata-label';
      focalLengthLabel.textContent = 'Focal Length: ';
      
      const focalLengthValue = document.createElement('span');
      focalLengthValue.textContent = `${typeof photo.exif.FocalLength === 'number' ? 
        photo.exif.FocalLength.toFixed(1) : 
        photo.exif.FocalLength}mm`;
      
      focalLengthItem.appendChild(focalLengthLabel);
      focalLengthItem.appendChild(focalLengthValue);
      metadata.appendChild(focalLengthItem);
    }
    
    // Add all elements to fragment
    fragment.appendChild(header);
    fragment.appendChild(img);
    fragment.appendChild(metadata);
    
    return fragment;
  }
}
 