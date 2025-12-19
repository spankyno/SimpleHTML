import { supabase } from './src/supabaseClient.js'; // Ajusta la ruta si es necesario

const authOverlay = document.getElementById('auth-overlay');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const logoutBtn = document.getElementById('logout-btn');

let isLogin = true;

// 1. Alternar entre Login y Registro
toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    authTitle.innerText = isLogin ? "Iniciar Sesión" : "Crear Cuenta";
    authSubmitBtn.innerText = isLogin ? "Entrar" : "Registrarse";
    toggleAuth.innerText = isLogin ? "Regístrate aquí" : "Inicia sesión aquí";
});

// 2. Manejar el envío del formulario
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmail.value;
    const password = authPassword.value;

    if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
    } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert("Revisa tu email para confirmar el registro");
        else alert("¡Registro casi listo! Confirma tu correo.");
    }
});

// 3. Escuchar cambios de estado (Login/Logout)
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // Usuario conectado
        authOverlay.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        console.log("Sesión activa:", session.user.email);
    } else {
        // Usuario desconectado
        authOverlay.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
});

// 4. Cerrar sesión
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
});

//   Sample geotagged photos with real Unsplash images
const SAMPLE_PHOTOS = [
  {
    name: "Paris.jpg",
    url: "https://images.unsplash.com/photo-1577086664693-894d8405334a?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxnZW90YWdnZWQlMjBwaG90b3MlMjBvbiUyMG1hcHxlbnwwfHx8fDE3NDI4OTY1MDR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
    url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxnZW90YWdnZWQlMjBwaG90b3MlMjBvbiUyMG1hcHxlbnwwfHx8fDE3NDI4OTY1MDR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
    url: "https://images.unsplash.com/photo-1520299607509-dcd935f9a839?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxnZW90YWdnZWQlMjBwaG90b3MlMjBvbiUyMG1hcHxlbnwwfHx8fDE3NDI4OTY1MDR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
    url: "https://images.unsplash.com/photo-1488628176578-4ffd5fdbc900?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxnZW90YWdnZWQlMjBwaG90b3MlMjBvbiUyMG1hcHxlbnwwfHx8fDE3NDI4OTY1MDR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
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
    name: "Sydney.jpg",
    url: "https://images.unsplash.com/photo-1578403881967-084f9885be74?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxnZW90YWdnZWQlMjBwaG90b3MlMjBvbiUyMG1hcHxlbnwwfHx8fDE3NDI4OTY1MDR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
    coordinates: [-33.8688, 151.2093],
    exif: {
      Make: "Olympus",
      Model: "OM-D E-M1 Mark III",
      DateTime: "2023-01-15 09:45:30",
      ImageWidth: 5184,
      ImageHeight: 3888,
      FNumber: 4.5,
      ExposureTime: 1/320,
      ISO: 200,
      FocalLength: 12
    }
  }
];

// Utility functions
function formatCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined) return 'Not available';
  
  // Ensure values are numbers
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
  
  // Check if conversion resulted in valid numbers
  if (isNaN(latNum) || isNaN(lngNum)) return 'Not available';
  
  return `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`;
}

function formatDate(date) {
  if (!date) return '';
  
  if (date instanceof Date) {
    return date.toLocaleString();
  }
  
  return date;
}

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Main App class
class GeorefPhotosApp {
  constructor() {
    // State
    this.photos = [];
    this.map = null;
    this.markers = [];
    this.tooltips = [];
    this.baseMapType = 'OpenStreetMap';
    this.showLabels = true;
    this.selectedPhoto = null;
    this.tileLayer = null;
    
    // DOM Elements
    this.mapElement = document.getElementById('map');
    this.photoListElement = document.getElementById('photo-list');
    this.photoCountElement = document.getElementById('photo-count');
    this.photoInfoElement = document.getElementById('photo-info');
    this.searchInput = document.getElementById('search-input');
    this.clearSearchBtn = document.getElementById('clear-search');
    this.showLabelsCheckbox = document.getElementById('show-labels');
    this.exportKmlBtn = document.getElementById('export-kml-btn');
    this.toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    this.sidebarElement = document.getElementById('photo-sidebar');
    this.uploadBtn = document.getElementById('upload-btn');
    this.closeUploadBtn = document.getElementById('close-upload');
    this.uploadOverlay = document.getElementById('upload-overlay');
    this.uploadArea = document.getElementById('upload-area');
    this.fileInput = document.getElementById('file-input');
    this.uploadError = document.getElementById('upload-error');
    this.uploadDiscarded = document.getElementById('upload-discarded');
    this.uploadProcessing = document.getElementById('upload-processing');
    this.mapTypeBtn = document.getElementById('map-type-btn');
    this.mapDropdown = document.getElementById('map-dropdown');
    this.currentMapType = document.getElementById('current-map-type');
    
    // Init
    this.initMap();
    this.setupEventListeners();
    this.loadSamplePhotos();
  }
  
  // Initialize the map
  initMap() {
    // Create map
    this.map = L.map(this.mapElement, {
      zoomControl: false // Disable default zoom control so we can reposition it
    }).setView([40, -3], 3);
    
    // Add custom zoom control in better position (to avoid overlapping with checkbox)
    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);
    
    // Add initial base layer
    this.setBaseMap(this.baseMapType);
  }
  
  // Set up event listeners
  setupEventListeners() {
    // Toggle sidebar
    this.toggleSidebarBtn.addEventListener('click', () => {
      this.sidebarElement.classList.toggle('open');
    });
    
    // Search input
    this.searchInput.addEventListener('input', () => {
      this.filterPhotoList(this.searchInput.value);
    });
    
    // Clear search button
    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.filterPhotoList('');
      this.clearSearchBtn.classList.add('hidden');
    });
    
    // Show/hide labels checkbox
    this.showLabelsCheckbox.addEventListener('change', () => {
      this.showLabels = this.showLabelsCheckbox.checked;
      this.updateTooltips();
    });
    
    // Export KML button
    this.exportKmlBtn.addEventListener('click', () => {
      this.exportKML();
    });
    
    // Upload button
    this.uploadBtn.addEventListener('click', () => {
      this.uploadOverlay.classList.remove('hidden');
    });
    
    // Close upload dialog
    this.closeUploadBtn.addEventListener('click', () => {
      this.uploadOverlay.classList.add('hidden');
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
        this.setBaseMap(mapType);
        this.currentMapType.textContent = mapType;
        this.mapDropdown.parentElement.classList.remove('active');
      });
    });
    
    // File drop area
    this.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadArea.classList.add('dragging');
    });
    
    this.uploadArea.addEventListener('dragleave', () => {
      this.uploadArea.classList.remove('dragging');
    });
    
    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('dragging');
      if (e.dataTransfer.files.length > 0) {
        this.processFiles(e.dataTransfer.files);
      }
    });
    
    // File input
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.processFiles(e.target.files);
      }
    });
  }
  
  // Load sample photos
  loadSamplePhotos() {
    this.photos = SAMPLE_PHOTOS.map(photo => ({
      id: generateId(),
      name: photo.name,
      url: photo.url,
      coordinates: photo.coordinates,
      exif: photo.exif
    }));
    
    this.updatePhotoList();
    this.updateMarkers();
    this.exportKmlBtn.disabled = false;
  }
  
  // Update the photo list in the sidebar
  updatePhotoList() {
    // Clear the current list
    this.photoListElement.innerHTML = '';
    this.photoCountElement.textContent = this.photos.length;
    
    if (this.photos.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'empty-list';
      emptyEl.textContent = 'No photos available';
      this.photoListElement.appendChild(emptyEl);
      return;
    }
    
    // Add photos to the list
    this.photos.forEach(photo => {
      const li = document.createElement('li');
      li.className = 'photo-item';
      li.dataset.id = photo.id;
      li.dataset.coordinates = JSON.stringify(photo.coordinates);
      
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
      photoName.title = photo.name;
      
      const photoDate = document.createElement('div');
      photoDate.className = 'photo-date';
      photoDate.textContent = photo.exif.DateTime || 'No date available';
      
      const photoCoords = document.createElement('div');
      photoCoords.className = 'photo-coords';
      photoCoords.textContent = formatCoordinates(photo.coordinates[0], photo.coordinates[1]);
      
      photoDetails.appendChild(photoName);
      photoDetails.appendChild(photoDate);
      photoDetails.appendChild(photoCoords);
      
      li.appendChild(photoIcon);
      li.appendChild(photoDetails);
      
      // Add click handler
      li.addEventListener('click', () => {
        this.selectPhoto(photo);
      });
      
      this.photoListElement.appendChild(li);
    });
  }
  
  // Filter the photo list based on search term
  filterPhotoList(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    // Show/hide clear button
    if (term.length === 0) {
      this.clearSearchBtn.classList.add('hidden');
    } else {
      this.clearSearchBtn.classList.remove('hidden');
    }
    
    // Filter items
    const items = this.photoListElement.querySelectorAll('.photo-item');
    
    if (items.length === 0) return;
    
    let matchCount = 0;
    
    items.forEach(item => {
      const name = item.querySelector('.photo-name').textContent.toLowerCase();
      if (name.includes(term)) {
        item.style.display = '';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    // Show empty message if no matches
    let emptyEl = this.photoListElement.querySelector('.empty-list');
    
    if (matchCount === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'empty-list';
        this.photoListElement.appendChild(emptyEl);
      }
      emptyEl.textContent = 'No photos match your search';
      emptyEl.style.display = '';
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }
  
  // Update map markers
  updateMarkers() {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    
    // Clear existing tooltips
    this.tooltips.forEach(tooltip => tooltip.remove());
    this.tooltips = [];
    
    if (this.photos.length === 0) return;
    
    // Create icon
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Create bounds to fit all markers
    const bounds = L.latLngBounds();
    
    // Add markers for each photo
    this.photos.forEach(photo => {
      if (!photo.coordinates) return;
      
      // Add to bounds
      bounds.extend(photo.coordinates);
      
      // Create marker
      const marker = L.marker(photo.coordinates, {
        icon: icon,
        title: photo.name
      });
      
      // Add popup
      marker.bindPopup(`
        <div class="popup-content">
          <img src="${photo.url}" alt="${photo.name}" />
          <h3>${photo.name}</h3>
          <button class="view-details" data-photo-id="${photo.id}">View Details</button>
        </div>
      `);
      
      // Add tooltip if enabled
      if (this.showLabels) {
        const tooltip = L.tooltip({
          permanent: true,
          direction: 'top',
          offset: [0, -40]
        })
        .setLatLng(photo.coordinates)
        .setContent(`<span class="tooltip-content">${photo.name}</span>`)
        .addTo(this.map);
        
        this.tooltips.push(tooltip);
      }
      
      // Add click handler
      marker.on('click', () => {
        this.selectPhoto(photo);
      });
      
      marker.addTo(this.map);
      this.markers.push(marker);
    });
    
    // Set up popup click handlers
    this.map.on('popupopen', (e) => {
      const popup = e.popup;
      const container = popup.getElement();
      const button = container.querySelector('.view-details');
      
      if (button) {
        button.addEventListener('click', () => {
          const photoId = button.getAttribute('data-photo-id');
          const photo = this.photos.find(p => p.id === photoId);
          if (photo) {
            this.selectPhoto(photo);
          }
        });
      }
    });
    
    // Fit map to bounds
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12
      });
    }
  }
  
  // Update tooltips based on showLabels setting
  updateTooltips() {
    // Remove existing tooltips
    this.tooltips.forEach(tooltip => tooltip.remove());
    this.tooltips = [];
    
    if (!this.showLabels) return;
    
    // Add tooltips for each marker
    this.photos.forEach(photo => {
      if (!photo.coordinates) return;
      
      const tooltip = L.tooltip({
        permanent: true,
        direction: 'top',
        offset: [0, -40]
      })
      .setLatLng(photo.coordinates)
      .setContent(`<span class="tooltip-content">${photo.name}</span>`)
      .addTo(this.map);
      
      this.tooltips.push(tooltip);
    });
  }
  
  // Select a photo
  selectPhoto(photo) {
    this.selectedPhoto = photo;
    
    // Update list selection
    const items = this.photoListElement.querySelectorAll('.photo-item');
    items.forEach(item => {
      if (item.dataset.id === photo.id) {
        item.classList.add('selected');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
    
    // Show photo info
    this.showPhotoInfo(photo);
    
    // Zoom to photo
    this.map.setView(photo.coordinates, 18, {
      animate: true,
      duration: 0.8
    });
    
    // Find and open the marker popup
    this.markers.forEach(marker => {
      const markerLatLng = marker.getLatLng();
      const photoLatLng = L.latLng(photo.coordinates);
      
      if (markerLatLng.distanceTo(photoLatLng) < 10) {
        marker.openPopup();
      }
    });
  }
  
  // Show photo info panel
  showPhotoInfo(photo) {
    // Create content
    const content = document.createElement('div');
    
    // Header
    const header = document.createElement('div');
    header.className = 'photo-info-header';
    
    const title = document.createElement('h3');
    title.className = 'photo-info-title';
    title.textContent = photo.name;
    title.title = photo.name;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeBtn.addEventListener('click', () => {
      this.hidePhotoInfo();
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Image
    const img = document.createElement('img');
    img.className = 'photo-preview';
    img.src = photo.url;
    img.alt = photo.name;
    
    // Metadata
    const metadata = document.createElement('div');
    metadata.className = 'photo-metadata';
    
    // Add coordinates
    const coordsItem = document.createElement('div');
    coordsItem.className = 'metadata-item';
    coordsItem.innerHTML = `
      <span class="metadata-label">Coordinates: </span>
      ${formatCoordinates(photo.coordinates[0], photo.coordinates[1])}
    `;
    metadata.appendChild(coordsItem);
    
    // Add camera info if available
    if (photo.exif.Make) {
      const cameraItem = document.createElement('div');
      cameraItem.className = 'metadata-item';
      cameraItem.innerHTML = `
        <span class="metadata-label">Camera: </span>
        ${photo.exif.Make} ${photo.exif.Model || ''}
      `;
      metadata.appendChild(cameraItem);
    }
    
    // Add date if available
    if (photo.exif.DateTime) {
      const dateItem = document.createElement('div');
      dateItem.className = 'metadata-item';
      dateItem.innerHTML = `
        <span class="metadata-label">Date: </span>
        ${photo.exif.DateTime}
      `;
      metadata.appendChild(dateItem);
    }
    
    // Add resolution if available
    if (photo.exif.ImageWidth && photo.exif.ImageHeight) {
      const resolutionItem = document.createElement('div');
      resolutionItem.className = 'metadata-item';
      resolutionItem.innerHTML = `
        <span class="metadata-label">Resolution: </span>
        ${photo.exif.ImageWidth} x ${photo.exif.ImageHeight}
      `;
      metadata.appendChild(resolutionItem);
    }
    
    // Add aperture if available
    if (photo.exif.FNumber) {
      const apertureItem = document.createElement('div');
      apertureItem.className = 'metadata-item';
      apertureItem.innerHTML = `
        <span class="metadata-label">Aperture: </span>
        f/${typeof photo.exif.FNumber === 'number' ? photo.exif.FNumber.toFixed(1) : photo.exif.FNumber}
      `;
      metadata.appendChild(apertureItem);
    }
    
    // Add exposure if available
    if (photo.exif.ExposureTime) {
      const exposureItem = document.createElement('div');
      exposureItem.className = 'metadata-item';
      exposureItem.innerHTML = `
        <span class="metadata-label">Exposure: </span>
        ${typeof photo.exif.ExposureTime === 'number' ? photo.exif.ExposureTime.toFixed(4) : photo.exif.ExposureTime} sec
      `;
      metadata.appendChild(exposureItem);
    }
    
    // Add ISO if available
    if (photo.exif.ISO) {
      const isoItem = document.createElement('div');
      isoItem.className = 'metadata-item';
      isoItem.innerHTML = `
        <span class="metadata-label">ISO: </span>
        ${photo.exif.ISO}
      `;
      metadata.appendChild(isoItem);
    }
    
    // Add focal length if available
    if (photo.exif.FocalLength) {
      const focalLengthItem = document.createElement('div');
      focalLengthItem.className = 'metadata-item';
      focalLengthItem.innerHTML = `
        <span class="metadata-label">Focal Length: </span>
        ${typeof photo.exif.FocalLength === 'number' ? photo.exif.FocalLength.toFixed(1) : photo.exif.FocalLength}mm
      `;
      metadata.appendChild(focalLengthItem);
    }
    
    // Assemble and show
    content.appendChild(header);
    content.appendChild(img);
    content.appendChild(metadata);
    
    this.photoInfoElement.innerHTML = '';
    this.photoInfoElement.appendChild(content);
    this.photoInfoElement.classList.remove('hidden');
  }
  
  // Hide photo info panel
  hidePhotoInfo() {
    this.photoInfoElement.classList.add('hidden');
    this.photoInfoElement.innerHTML = '';
  }
  
  // Process uploaded files
  async processFiles(files) {
    // Reset UI
    this.uploadError.classList.add('hidden');
    this.uploadDiscarded.classList.add('hidden');
    this.uploadProcessing.classList.remove('hidden');
    
    try {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      const totalCount = imageFiles.length;
      
      if (totalCount === 0) {
        this.uploadError.textContent = "Please select image files.";
        this.uploadError.classList.remove('hidden');
        this.uploadProcessing.classList.add('hidden');
        return;
      }
      
      const processedPhotos = [];
      let discardedCount = 0;
      
      // Process each file
      for (const file of imageFiles) {
        try {
          // Get EXIF data including GPS coordinates
          const exifData = await window.exifr.parse(file, {
            gps: true,
            tiff: true,
            exif: true
          });
          
          // Only use files with GPS data
          if (exifData && exifData.latitude && exifData.longitude) {
            const url = URL.createObjectURL(file);
            
            processedPhotos.push({
              id: generateId(),
              name: file.name,
              url: url,
              coordinates: [exifData.latitude, exifData.longitude],
              exif: {
                Make: exifData.Make,
                Model: exifData.Model,
                DateTime: exifData.DateTimeOriginal ? formatDate(exifData.DateTimeOriginal) : undefined,
                ImageWidth: exifData.ImageWidth,
                ImageHeight: exifData.ImageHeight,
                ExposureTime: exifData.ExposureTime,
                FNumber: exifData.FNumber,
                ISO: exifData.ISO,
                FocalLength: exifData.FocalLength
              }
            });
          } else {
            discardedCount++;
          }
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
          discardedCount++;
        }
      }
      
      // If we have no processed photos, use sample photos
      if (processedPhotos.length === 0) {
        this.uploadError.textContent = "None of the selected files contain GPS coordinates. Please select geotagged images.";
        this.uploadError.classList.remove('hidden');
        this.uploadProcessing.classList.add('hidden');
        return;
      }
      
      // Show discarded message if needed
      if (discardedCount > 0) {
        this.uploadDiscarded.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>${discardedCount} image${discardedCount !== 1 ? 's' : ''} without GPS data ${discardedCount !== 1 ? 'were' : 'was'} discarded.</span>
        `;
        this.uploadDiscarded.classList.remove('hidden');
      }
      
      // Update app with new photos
      this.photos = processedPhotos;
      this.updatePhotoList();
      this.updateMarkers();
      this.exportKmlBtn.disabled = false;
      
      // Close dialog after a delay
      setTimeout(() => {
        this.uploadOverlay.classList.add('hidden');
        this.uploadProcessing.classList.add('hidden');
      }, discardedCount > 0 ? 2000 : 1000);
      
    } catch (err) {
      this.uploadError.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Error processing images: ${err.message}</span>
      `;
      this.uploadError.classList.remove('hidden');
      this.uploadProcessing.classList.add('hidden');
    }
  }
  
  // Export KML file
  exportKML() {
    if (this.photos.length === 0) return;
    
    // Generate KML content
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
    this.photos.forEach(photo => {
      if (!photo.coordinates) return;
      
      const [lat, lng] = photo.coordinates;
      const description = `
        <![CDATA[
          <div>
            <img src="${photo.url}" alt="${photo.name}" style="max-width:200px;max-height:200px;margin-bottom:10px;" />
            <p><strong>File:</strong> ${photo.name}</p>
            ${photo.exif.DateTime ? `<p><strong>Date:</strong> ${photo.exif.DateTime}</p>` : ''}
            ${photo.exif.Make ? `<p><strong>Camera:</strong> ${photo.exif.Make} ${photo.exif.Model || ''}</p>` : ''}
          </div>
        ]]>
      `;

      kml += `
      <Placemark>
        <name>${photo.name}</name>
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

    // Create blob and download
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'georef_photos.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Set the base map
  setBaseMap(type) {
    this.baseMapType = type;
    
    // Remove existing layer
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }
    
    // Get configuration for selected map type
    let config;
    
    switch (type) {
      case 'Google Maps':
        config = {
          url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          attribution: '&copy; Google Maps',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        };
        break;
      case 'Bing Maps':
        config = {
          url: 'https://tiles.bing.net/tiles/microsoft.imagery/{z}/{x}/{y}.jpeg?g=14364',
          attribution: '&copy; Microsoft',
          subdomains: 'abc'
        };
        break;
      case 'ESRI World Imagery':
        config = {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and others',
          subdomains: 'abc'
        };
        break;
      case 'OpenStreetMap':
      default:
        config = {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abc'
        };
    }
    
    // Add the new layer
    this.tileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: config.subdomains
    }).addTo(this.map);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GeorefPhotosApp();
});
 
