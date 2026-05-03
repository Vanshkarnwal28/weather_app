import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Wind, Droplets, ThermometerSun, Loader2 } from 'lucide-react';
import axios from 'axios';

function Dashboard({ weather, error, getWeatherIcon }) {
  const [defaultWeather, setDefaultWeather] = useState(null);
  const [loadingDefault, setLoadingDefault] = useState(false);

  useEffect(() => {
    if (weather) return;

    const fetchDefaultWeather = async () => {
      setLoadingDefault(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${apiUrl}/api/weather?city=New Delhi`);
        setDefaultWeather(res.data);
      } catch (err) {
        console.error('Failed to fetch default dashboard data', err);
      } finally {
        setLoadingDefault(false);
      }
    };

    fetchDefaultWeather();
  }, [weather]);

  const activeWeather = weather || defaultWeather;

  return (
    <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel"
            style={{ padding: '1.5rem 2rem', background: 'rgba(220, 38, 38, 0.4)', color: '#fee2e2', marginBottom: '2rem', borderRadius: '12px' }}
          >
            {error}
          </motion.div>
        )}

        {loadingDefault && !activeWeather ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={48} color="#ffd700" />
          </div>
        ) : activeWeather && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: '100%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
          >
            {/* Primary Widget: Temperature & Location */}
            <div className="glass-panel" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '4rem', minHeight: '350px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', opacity: 0.8 }}>
                  <MapPin size={24} color="#ffd700" />
                  <h2 className="shine-gold" style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                    {!weather ? `Global Focus: ${activeWeather.name}` : `${activeWeather.name}, ${activeWeather.sys.country}`}
                  </h2>
                </div>
                <h1 style={{ fontSize: '8rem', fontWeight: 700, lineHeight: 1, margin: 0, textShadow: '0 10px 40px rgba(255,215,0,0.4)' }}>
                  {Math.round(activeWeather.main.temp)}°
                </h1>
                <p style={{ fontSize: '2rem', fontWeight: 300, textTransform: 'capitalize', marginTop: '0.5rem', opacity: 0.8 }}>
                  {activeWeather.weather[0].description}
                </p>
              </div>
              <img 
                src={getWeatherIcon(activeWeather.weather[0].icon)} 
                alt="weather condition" 
                style={{ width: '200px', height: '200px', filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.6)) brightness(1.2)' }} 
              />
            </div>

            {/* Secondary Metrics Grid */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7, marginBottom: '1rem' }}>
                <ThermometerSun size={24} color="#ffd700" />
                <span className="shine-gold" style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Feels Like</span>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 600, margin: 0 }}>{Math.round(activeWeather.main.feels_like)}°</h3>
              <p style={{ opacity: 0.5, marginTop: '1rem', fontSize: '0.9rem' }}>Slightly different based on wind and humidity.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7, marginBottom: '1rem' }}>
                <Wind size={24} color="#ffd700" />
                <span className="shine-gold" style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Wind Speed</span>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 600, margin: 0 }}>{activeWeather.wind.speed} <span style={{fontSize: '1.5rem', opacity:0.5}}>m/s</span></h3>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,215,0,0.2)', borderRadius: '2px', marginTop: '1.5rem' }}>
                 <div style={{ width: `${Math.min((activeWeather.wind.speed / 20) * 100, 100)}%`, height: '100%', background: '#ffd700', borderRadius: '2px', boxShadow: '0 0 10px #ffd700' }} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7, marginBottom: '1rem' }}>
                <Droplets size={24} color="#ffd700" />
                <span className="shine-gold" style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Humidity</span>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 600, margin: 0 }}>{activeWeather.main.humidity}<span style={{fontSize: '2rem', opacity: 0.5}}>%</span></h3>
              <p style={{ opacity: 0.5, marginTop: '1rem', fontSize: '0.9rem' }}>Dew point affects perceived temperature.</p>
            </div>

            {/* Quick News Widget */}
            {activeWeather.news && activeWeather.news.length > 0 && (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '2rem' }}>
                <h3 className="shine-gold" style={{ fontSize: '1.5rem', letterSpacing: '1px', marginBottom: '1.5rem', margin: 0 }}>LATEST CITY TRANSMISSIONS</h3>
                <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,215,0,0.5) transparent' }}>
                  {activeWeather.news.map((article, idx) => (
                    <a key={idx} href={article.url} target="_blank" rel="noopener noreferrer" style={{ minWidth: '320px', maxWidth: '320px', flex: '0 0 auto', textDecoration: 'none', color: 'white', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.8rem', transition: 'all 0.3s ease' }}
                       onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.6)'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; }}
                    >
                      <h4 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</h4>
                      <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0, marginTop: 'auto' }}>{article.source}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Dashboard;
