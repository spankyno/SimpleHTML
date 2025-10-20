//  Utility functions

/**
 * Formats coordinates to a readable format
 */
function formatCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined) return 'Not available';
  
  // Ensure values are numbers
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
  
  // Check if conversion resulted in valid numbers
  if (isNaN(latNum) || isNaN(lngNum)) return 'Not available';
  
  return `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`;
}

/**
 * Formats a date value to a readable format
 */
function formatDate(date) {
  if (!date) return '';
  
  if (date instanceof Date) {
    return date.toLocaleString();
  }
  
  return date;
}

/**
 * Safely gets a nested property of an object
 */
function getNestedProperty(obj, path, defaultValue = '') {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined && current !== null ? current : defaultValue;
}

/**
 * Generate a unique ID
 */
function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create an HTML element with attributes and children
 */
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  }
  
  // Append children
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      }
    });
  } else if (typeof children === 'string') {
    element.appendChild(document.createTextNode(children));
  } else if (children) {
    element.appendChild(children);
  }
  
  return element;
}
 