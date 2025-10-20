//  Main application class
class App {
  constructor() {
    // Services
    this.imageProcessor = new ImageProcessor();
    this.kmlGenerator = new KmlGenerator();
    this.mapManager = new MapManager();
    this.photoList = new PhotoList();
    this.photoInfo = new PhotoInfo();
    
    // State
    this.photos = [];
    
    // DOM elements
    this.toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    this.sidebar = document.getElementById('photo-sidebar');
    this.uploadBtn = document.getElementById('upload-btn');
    this.exportKmlBtn = document.getElementById('export-kml-btn');
    this.mapTypeBtn = document.getElementById('map-type-btn');
    this.mapDropdown = document.getElementById('map-dropdown');
    this.currentMapType = document.getElementById('current-map-type');
    this.showLabelsCheckbox = document.getElementById('show-labels');
    this.uploadOverlay = document.getElementById('upload-overlay');
    this.closeUploadBtn = document.getElementById('close-upload');
    this.uploadArea = document.getElementById('upload-area');
    this.fileInput = document.getElementById('file-input');
    this.uploadError = document.getElementById('upload-error');
    this.uploadDiscarded = document.getElementById('upload-discarded');
    this.uploadProcessing = document.getElementById('upload-processing');
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the application
   */
  init() {
    // Initialize map
    this.mapManager.initMap('map');
    
    // Set up event handlers
    this.setupEventHandlers();
    
    // Load sample data
    this.loadSampleData();
  }
  
  /**
   * Set up event handlers
   */
  setupEventHandlers() {
    // Toggle sidebar
    this.toggleSidebarBtn.addEventListener('click', () => {
      this.sidebar.classList.toggle('open');
    });
    
    // Upload button
    this.uploadBtn.addEventListener('click', () => {
      this.uploadOverlay.classList.remove('hidden');
    });
    
    // Close upload overlay
    this.closeUploadBtn.addEventListener('click', () => {
      this.uploadOverlay.classList.add('hidden');
    });
    
    // Export KML button
    this.exportKmlBtn.addEventListener('click', () => {
      this.kmlGenerator.downloadKML(this.photos);
    });
    
    // Map type dropdown
    this.mapTypeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.mapDropdown.parentElement.classList.toggle('active');
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', () => {
      if (this.mapDropdown.parentElement.classList.contains('active')) {
        this.mapDropdown.parentElement.classList.remove('active');
      }
    });
    
    // Map type selection
    document.querySelectorAll('#map-dropdown a').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const mapType = e.target.getAttribute('data-map');
        this.mapManager.setBaseMap(mapType);
        this.currentMapType.textContent = mapType;
        this.mapDropdown.parentElement.classList.remove('active');
      });
    });
    
    // Show labels checkbox
    this.showLabelsCheckbox.addEventListener('change', () => {
      this.mapManager.toggleLabels(this.showLabelsCheckbox.checked);
    });
    
    // File input
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFiles(e.target.files);
      }
    });
    
    // Drag and drop
    this.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadArea.classList.add('dragging');
    });
    
    this.uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('dragging');
    });
    
    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('dragging');
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleFiles(e.dataTransfer.files);
      }
    });
  }
  
  /**
   * Load sample data
   */
  async loadSampleData() {
    try {
      const samplePhotos = this.imageProcessor.loadSamplePhotos();
      this.photos = samplePhotos;
      
      // Update photo list
      this.photoList.updatePhotoList(this.photos, (photo) => {
        this.selectPhoto(photo);
      });
      
      // Add markers to map
      this.mapManager.addMarkers(this.photos, (photo) => {
        this.selectPhoto(photo);
      });
      
      // Enable export button
      this.exportKmlBtn.disabled = false;
    } catch (error) {
      console.error('Error loading sample data:', error);
    }
  }
  
  /**
   * Handle uploaded files
   */
  async handleFiles(fileList) {
    // Reset UI
    this.uploadError.classList.add('hidden');
    this.uploadDiscarded.classList.add('hidden');
    this.uploadProcessing.classList.remove('hidden');
    
    try {
      const totalImageCount = Array.from(fileList).filter(file => 
        file.type.startsWith('image/')
      ).length;
      
      const processedPhotos = await this.imageProcessor.processImages(fileList);
      
      if (processedPhotos.length === 0) {
        this.uploadError.textContent = "None of the selected files contain GPS coordinates. Please select geotagged images.";
        this.uploadError.classList.remove('hidden');
      } else {
        const discarded = totalImageCount - processedPhotos.length;
        
        if (discarded > 0) {
          this.uploadDiscarded.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${discarded} image${discarded !== 1 ? 's' : ''} without GPS data ${discarded !== 1 ? 'were' : 'was'} discarded.</span>
          `;
          this.uploadDiscarded.classList.remove('hidden');
        }
        
        this.photos = processedPhotos;
        
        // Update photo list
        this.photoList.updatePhotoList(this.photos, (photo) => {
          this.selectPhoto(photo);
        });
        
        // Add markers to map
        this.mapManager.addMarkers(this.photos, (photo) => {
          this.selectPhoto(photo);
        });
        
        // Enable export button
        this.exportKmlBtn.disabled = false;
        
        // Close the overlay after a delay to show the discarded message
        setTimeout(() => {
          this.uploadOverlay.classList.add('hidden');
        }, discarded > 0 ? 2000 : 1000);
      }
    } catch (err) {
      this.uploadError.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Error processing images: ${err instanceof Error ? err.message : String(err)}</span>
      `;
      this.uploadError.classList.remove('hidden');
    } finally {
      this.uploadProcessing.classList.add('hidden');
    }
  }
  
  /**
   * Select a photo
   */
  selectPhoto(photo) {
    if (!photo) return;
    
    // Update photo list selection
    this.photoList.selectPhoto(photo.id);
    
    // Show photo info
    this.photoInfo.showPhotoInfo(photo);
    
    // Select on map
    this.mapManager.selectPhoto(photo);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
 