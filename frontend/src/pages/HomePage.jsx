import { motion } from 'framer-motion';
import { Compass, Search, Loader2 } from 'lucide-react';

function HomePage({ city, setCity, fetchWeather, loading }) {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}
    >
      <div className="clouds-container"></div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}
      >
        <Compass size={100} color="#2563eb" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(37,99,235,0.2))' }} />
        
        <h1 className="shine-text hero-title" style={{ fontSize: '6rem', fontWeight: 800, letterSpacing: '6px', margin: 0 }}>
          AURA
        </h1>
        
        <p style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.8)', padding: '8px 24px', borderRadius: '30px', border: '1px solid rgba(37,99,235,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <span className="shine-blue hero-subtitle" style={{ fontSize: '1.4rem', letterSpacing: '3px', fontWeight: 600 }}>GLOBAL TELEMETRY & NEWS</span>
        </p>

        <p style={{ marginTop: '3rem', maxWidth: '650px', fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, letterSpacing: '0.5px' }}>
          Access real-time atmospheric data, interactive global telemetry maps, 72-hour trajectory forecasts, and localized news transmissions from any sector on Earth.
        </p>

        <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '500px', marginTop: '3rem' }}>
          <input 
            type="text" 
            placeholder="Search for a city to initialize telemetry..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="glass-input"
            style={{ flex: 1, padding: '1.2rem 1.8rem', borderRadius: '50px', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="glass-input"
            style={{ borderRadius: '50px', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', background: '#2563eb', color: 'white', border: 'none', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
          </button>
        </form>
      </motion.div>
    </motion.main>
  );
}

export default HomePage;
