/**
  * Manage the Leaflet map and markers
 */
class MapManager {
  constructor() {
    this.map = null;
    this.tileLayer = null;
    this.markers = [];
    this.tooltips = [];
    this.baseMapType = 'OpenStreetMap';
    this.showLabels = true;
    this.selectedPhoto = null;
  }
  
  /**
   * Initialize the map
   */
  initMap(mapContainerId) {
    // Create map
    this.map = L.map(mapContainerId).setView([40, -3], 3);
    
    // Add initial tile layer
    this.setBaseMap(this.baseMapType);
    
    return this.map;
  }
  
  /**
   * Change the base map
   */
  setBaseMap(type) {
    this.baseMapType = type;
    
    // Remove existing tile layer if any
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }
    
    // Get base map URL and attribution
    const { url, attribution, subdomains } = this.getBaseMapConfig(type);
    
    // Add new tile layer
    this.tileLayer = L.tileLayer(url, {
      attribution: attribution,
      subdomains: subdomains
    }).addTo(this.map);
    
    return this.tileLayer;
  }
  
  /**
   * Get base map configuration
   */
  getBaseMapConfig(type) {
    switch (type) {
      case 'OpenStreetMap':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abc'
        };
      case 'Google Maps':
        return {
          url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          attribution: '&copy; Google Maps',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        };
      case 'Bing Maps':
        return {
          url: 'https://tiles.bing.net/tiles/microsoft.imagery/{z}/{x}/{y}.jpeg?g=14364',
          attribution: '&copy; Microsoft',
          subdomains: 'abc'
        };
      case 'ESRI World Imagery':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and others',
          subdomains: 'abc'
        };
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abc'
        };
    }
  }
  
  /**
   * Clear all markers and tooltips
   */
  clearMarkers() {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
    this.tooltips.forEach(tooltip => this.map.removeLayer(tooltip));
    this.tooltips = [];
  }
  
  /**
   * Add markers for photos
   */
  addMarkers(photos, onSelectPhoto) {
    // Clear existing markers
    this.clearMarkers();
    
    if (photos.length === 0) return;
    
    // Filter out photos without coordinates
    const validPhotos = photos.filter(photo => photo.coordinates);
    
    // Create bounds to fit all markers
    const bounds = L.latLngBounds([]);
    
    // Create icon
    const customIcon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Add markers for each photo
    validPhotos.forEach(photo => {
      // Add to bounds
      bounds.extend(photo.coordinates);
      
      // Create marker
      const marker = L.marker(photo.coordinates, {
        icon: customIcon,
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
      
      // Add click event
      marker.on('click', () => {
        if (onSelectPhoto) {
          onSelectPhoto(photo);
        }
      });
      
      // Add to map
      marker.addTo(this.map);
      this.markers.push(marker);
    });
    
    // Fit bounds if we have markers
    if (validPhotos.length > 0) {
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12
      });
    }
    
    // Set up popup listener for View Details button
    this.map.on('popupopen', e => {
      const button = document.querySelector('.popup-content .view-details');
      if (button) {
        button.addEventListener('click', () => {
          const photoId = button.getAttribute('data-photo-id');
          const photo = photos.find(p => p.id === photoId);
          if (photo && onSelectPhoto) {
            onSelectPhoto(photo);
          }
        });
      }
    });
  }
  
  /**
   * Toggle the visibility of labels
   */
  toggleLabels(show) {
    this.showLabels = show;
    
    // Remove existing tooltips
    this.tooltips.forEach(tooltip => this.map.removeLayer(tooltip));
    this.tooltips = [];
    
    if (show && this.markers.length > 0) {
      // Get all photos with markers
      const photosWithMarkers = Array.from(document.querySelectorAll('.photo-item'))
        .map(item => ({
          id: item.getAttribute('data-id'),
          name: item.querySelector('.photo-name').textContent,
          coordinates: JSON.parse(item.getAttribute('data-coordinates'))
        }))
        .filter(photo => photo.coordinates);
      
      // Add tooltips
      photosWithMarkers.forEach(photo => {
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
  }
  
  /**
   * Select a photo and zoom to it
   */
  selectPhoto(photo) {
    if (!photo || !photo.coordinates) return;
    
    this.selectedPhoto = photo;
    
    // Zoom to photo with maximum zoom level
    this.map.setView(photo.coordinates, 18, {
      animate: true,
      duration: 0.8
    });
    
    // Find and highlight the marker
    this.markers.forEach(marker => {
      const markerLatLng = marker.getLatLng();
      const photoLatLng = L.latLng(photo.coordinates);
      
      if (markerLatLng.equals(photoLatLng, 0.0001)) {
        marker.openPopup();
      }
    });
  }
}
 