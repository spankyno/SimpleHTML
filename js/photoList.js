/**
  * Manage the photo list sidebar
 */
class PhotoList {
  constructor() {
    this.photos = [];
    this.filteredPhotos = [];
    this.selectedPhotoId = null;
    this.listElement = document.getElementById('photo-list');
    this.searchInput = document.getElementById('search-input');
    this.clearSearchButton = document.getElementById('clear-search');
    this.photoCountElement = document.getElementById('photo-count');
    
    // Set up event handlers
    this.setupEventHandlers();
  }
  
  /**
   * Set up event handlers
   */
  setupEventHandlers() {
    // Search input
    this.searchInput.addEventListener('input', () => {
      this.filterPhotos(this.searchInput.value);
    });
    
    // Clear search button
    this.clearSearchButton.addEventListener('click', () => {
      this.searchInput.value = '';
      this.filterPhotos('');
      this.clearSearchButton.classList.add('hidden');
    });
  }
  
  /**
   * Update the photo list
   */
  updatePhotoList(photos, onSelectPhoto) {
    this.photos = photos;
    this.filteredPhotos = [...photos];
    this.renderPhotoList(onSelectPhoto);
    this.updatePhotoCount();
  }
  
  /**
   * Filter photos based on search term
   */
  filterPhotos(searchTerm) {
    if (searchTerm.trim() === '') {
      this.filteredPhotos = [...this.photos];
      this.clearSearchButton.classList.add('hidden');
    } else {
      this.filteredPhotos = this.photos.filter(photo => 
        photo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.clearSearchButton.classList.remove('hidden');
    }
    
    // Re-render the list
    this.renderPhotoList();
    
    // Preserve selection if possible
    if (this.selectedPhotoId) {
      const selectedItem = document.querySelector(`.photo-item[data-id="${this.selectedPhotoId}"]`);
      if (selectedItem) {
        selectedItem.classList.add('selected');
      }
    }
  }
  
  /**
   * Render the photo list
   */
  renderPhotoList(onSelectPhoto) {
    // Clear current list
    this.listElement.innerHTML = '';
    
    if (this.filteredPhotos.length === 0) {
      // Show empty state
      const emptyElement = document.createElement('div');
      emptyElement.className = 'empty-list';
      emptyElement.textContent = this.searchInput.value 
        ? 'No photos match your search' 
        : 'No photos available';
      this.listElement.appendChild(emptyElement);
      return;
    }
    
    // Create list items
    this.filteredPhotos.forEach(photo => {
      const photoItem = this.createPhotoListItem(photo);
      
      // Add click handler
      photoItem.addEventListener('click', () => {
        // Remove selected class from all items
        document.querySelectorAll('.photo-item').forEach(item => {
          item.classList.remove('selected');
        });
        
        // Add selected class to this item
        photoItem.classList.add('selected');
        
        // Set selected photo ID
        this.selectedPhotoId = photo.id;
        
        // Call onSelectPhoto callback
        if (onSelectPhoto) {
          onSelectPhoto(photo);
        }
      });
      
      this.listElement.appendChild(photoItem);
    });
  }
  
  /**
   * Create a photo list item
   */
  createPhotoListItem(photo) {
    const li = document.createElement('li');
    li.className = 'photo-item';
    li.setAttribute('data-id', photo.id);
    if (photo.coordinates) {
      li.setAttribute('data-coordinates', JSON.stringify(photo.coordinates));
    }
    
    const photoIcon = document.createElement('div');
    photoIcon.className = 'photo-icon';
    photoIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-icon">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `;
    
    const photoDetails = document.createElement('div');
    photoDetails.className = 'photo-details';
    
    const photoName = document.createElement('div');
    photoName.className = 'photo-name';
    photoName.textContent = photo.name;
    photoName.setAttribute('title', photo.name);
    
    const photoDate = document.createElement('div');
    photoDate.className = 'photo-date';
    photoDate.textContent = photo.exif.DateTime || 'No date available';
    
    const photoCoords = document.createElement('div');
    photoCoords.className = 'photo-coords';
    if (photo.coordinates) {
      photoCoords.textContent = `${photo.coordinates[0].toFixed(4)}, ${photo.coordinates[1].toFixed(4)}`;
    } else {
      photoCoords.textContent = 'No coordinates';
    }
    
    photoDetails.appendChild(photoName);
    photoDetails.appendChild(photoDate);
    photoDetails.appendChild(photoCoords);
    
    li.appendChild(photoIcon);
    li.appendChild(photoDetails);
    
    return li;
  }
  
  /**
   * Update the photo count
   */
  updatePhotoCount() {
    this.photoCountElement.textContent = this.photos.length;
  }
  
  /**
   * Select a photo by ID
   */
  selectPhoto(photoId) {
    // Find the photo
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;
    
    // Remove selected class from all items
    document.querySelectorAll('.photo-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    // Add selected class to this item
    const photoItem = document.querySelector(`.photo-item[data-id="${photoId}"]`);
    if (photoItem) {
      photoItem.classList.add('selected');
      photoItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Set selected photo ID
    this.selectedPhotoId = photoId;
    
    return photo;
  }
}
 