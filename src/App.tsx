import  { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import UploadOverlay from './components/UploadOverlay';
import PhotoList from './components/PhotoList';

function App() {
  const [showUpload, setShowUpload] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <MapProvider>
        <Header 
          onUploadClick={() => setShowUpload(true)} 
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          showSidebar={showSidebar}
        />
        <main className="flex-1 relative flex">
          {showSidebar && <PhotoList />}
          <MapView />
          {showUpload && <UploadOverlay onClose={() => setShowUpload(false)} />}
        </main>
      </MapProvider>
    </div>
  );
}

export default App;
 