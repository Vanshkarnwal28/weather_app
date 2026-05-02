import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Wind, Droplets, ThermometerSun, Loader2, Compass } from 'lucide-react';

function Dashboard({ weather, city, setCity, fetchWeather, loading, error, getWeatherIcon }) {
  return (
    <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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

        {/* Centered Google-style Search when no weather is loaded */}
        {!weather && !error && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
              <Compass size={80} color="#ffffff" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' }} />
              <h1 className="shine-text" style={{ fontSize: '5rem', fontWeight: 700, letterSpacing: '4px', margin: 0, textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>AURA</h1>
              <p style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '5px 15px', borderRadius: '20px', border: '1px solid rgba(255,215,0,0.3)' }}>
                <span className="shine-gold" style={{ fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 500 }}>GLOBAL TELEMETRY & NEWS</span>
              </p>
            </div>

            <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '600px' }}>
              <input 
                type="text" 
                placeholder="Search for a city..." 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="glass-input"
                style={{ flex: 1, padding: '1.2rem 2rem', borderRadius: '50px', fontSize: '1.2rem' }}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="glass-input"
                style={{ borderRadius: '50px', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
              </button>
            </form>

            <p style={{ marginTop: '2.5rem', maxWidth: '600px', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, textAlign: 'center', letterSpacing: '0.5px' }}>
              Access real-time atmospheric data, interactive global telemetry maps, 72-hour trajectory forecasts, and localized news transmissions from any sector on Earth.
            </p>
          </motion.div>
        )}

        {weather && (
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
                  <h2 className="shine-gold" style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>{weather.name}, {weather.sys.country}</h2>
                </div>
                <h1 style={{ fontSize: '8rem', fontWeight: 700, lineHeight: 1, margin: 0, textShadow: '0 10px 40px rgba(255,215,0,0.4)' }}>
                  {Math.round(weather.main.temp)}°
                </h1>
                <p style={{ fontSize: '2rem', fontWeight: 300, textTransform: 'capitalize', marginTop: '0.5rem', opacity: 0.8 }}>
                  {weather.weather[0].description}
                </p>
              </div>
              <img 
                src={getWeatherIcon(weather.weather[0].icon)} 
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
              <h3 style={{ fontSize: '3.5rem', fontWeight: 600, margin: 0 }}>{Math.round(weather.main.feels_like)}°</h3>
              <p style={{ opacity: 0.5, marginTop: '1rem', fontSize: '0.9rem' }}>Slightly different based on wind and humidity.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7, marginBottom: '1rem' }}>
                <Wind size={24} color="#ffd700" />
                <span className="shine-gold" style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Wind Speed</span>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 600, margin: 0 }}>{weather.wind.speed} <span style={{fontSize: '1.5rem', opacity:0.5}}>m/s</span></h3>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,215,0,0.2)', borderRadius: '2px', marginTop: '1.5rem' }}>
                 <div style={{ width: `${Math.min((weather.wind.speed / 20) * 100, 100)}%`, height: '100%', background: '#ffd700', borderRadius: '2px', boxShadow: '0 0 10px #ffd700' }} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7, marginBottom: '1rem' }}>
                <Droplets size={24} color="#ffd700" />
                <span className="shine-gold" style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Humidity</span>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 600, margin: 0 }}>{weather.main.humidity}<span style={{fontSize: '2rem', opacity: 0.5}}>%</span></h3>
              <p style={{ opacity: 0.5, marginTop: '1rem', fontSize: '0.9rem' }}>Dew point affects perceived temperature.</p>
            </div>

            {/* Quick News Widget */}
            {weather.news && weather.news.length > 0 && (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '2rem' }}>
                <h3 className="shine-gold" style={{ fontSize: '1.5rem', letterSpacing: '1px', marginBottom: '1.5rem', margin: 0 }}>LATEST CITY TRANSMISSIONS</h3>
                <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                  {weather.news.slice(0, 3).map((article, idx) => (
                    <a key={idx} href={article.url} target="_blank" rel="noopener noreferrer" style={{ minWidth: '300px', flex: 1, textDecoration: 'none', color: 'white', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.4 }}>{article.title}</h4>
                      <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>{article.source}</p>
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
