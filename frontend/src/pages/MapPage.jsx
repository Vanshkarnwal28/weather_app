import { motion } from 'framer-motion';

function MapPage({ weather }) {
  // If weather is provided, use the city map. Otherwise, default to India.
  const mapQuery = weather ? weather.name : 'India';
  const title = weather ? `City Map: ${weather.name}` : 'Global Map: India Focus';

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className="glass-panel" style={{ width: '100%', maxWidth: '1400px', height: '80vh', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
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
    </motion.main>
  );
}

export default MapPage;
