import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

function MapPage({ weather }) {
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // If weather is provided, use the city map. Otherwise, default to India.
  const mapQuery = weather ? weather.name : 'India';
  const title = weather ? `City Map: ${weather.name}` : 'Global Map: India Focus';

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoadingPhotos(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/photos?city=${mapQuery}`);
        setPhotos(response.data.photos);
      } catch (err) {
        console.error('Failed to fetch photos', err);
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchPhotos();
  }, [mapQuery]);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Map Section */}
        <div className="glass-panel" style={{ height: '70vh', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <h2 className="shine-gold" style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {title}
          </h2>
          
          <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,215,0,0.2)' }}>
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=${weather ? 12 : 5}&ie=UTF8&iwloc=&output=embed`}
              frameBorder="0"
              title="Google City Map"
              style={{ filter: 'invert(0.9) hue-rotate(180deg) contrast(1.2)' }} // Keeps the map in a cool dark mode
            ></iframe>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 className="shine-gold" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={24} color="#ffd700" />
            Visual Intelligence
          </h3>

          {loadingPhotos ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 className="animate-spin" size={40} color="#ffd700" />
            </div>
          ) : photos.length === 0 ? (
            <p style={{ opacity: 0.6, textAlign: 'center' }}>No visual data available for this sector.</p>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,215,0,0.5) transparent' }}>
              {photos.map((photo) => (
                <div 
                  key={photo.id}
                  style={{ minWidth: '350px', maxWidth: '350px', height: '250px', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,215,0,0.2)', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; }}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.alt_description || 'City photo'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <a 
                      href={photo.photographer_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#ffd700', textDecoration: 'none', fontSize: '0.85rem', opacity: 0.8 }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      📷 {photo.photographer}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.main>
  );
}

export default MapPage;
