import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

function HomePage() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}
      >
        <Compass size={100} color="#ffffff" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))' }} />
        
        <h1 className="shine-text" style={{ fontSize: '6rem', fontWeight: 800, letterSpacing: '6px', margin: 0, textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
          AURA
        </h1>
        
        <p style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.4)', padding: '8px 24px', borderRadius: '30px', border: '1px solid rgba(255,215,0,0.3)' }}>
          <span className="shine-gold" style={{ fontSize: '1.4rem', letterSpacing: '3px', fontWeight: 600 }}>GLOBAL TELEMETRY & NEWS</span>
        </p>

        <p style={{ marginTop: '3rem', maxWidth: '650px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, letterSpacing: '0.5px' }}>
          Access real-time atmospheric data, interactive global telemetry maps, 72-hour trajectory forecasts, and localized news transmissions from any sector on Earth.
        </p>
      </motion.div>
    </motion.main>
  );
}

export default HomePage;
