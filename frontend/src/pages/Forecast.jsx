import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Loader2 } from 'lucide-react';
import axios from 'axios';

function Forecast({ weather, getWeatherIcon }) {
  const [defaultForecast, setDefaultForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we already have a searched city's forecast, don't fetch default
    if (weather && weather.forecast) return;

    const fetchDefaultForecast = async () => {
      setLoading(true);
      try {
        // Fetch default weather for India (New Delhi)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${apiUrl}/api/weather?city=New Delhi`);
        setDefaultForecast(res.data);
      } catch (err) {
        console.error('Failed to fetch default forecast', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultForecast();
  }, [weather]);

  const activeWeather = weather && weather.forecast ? weather : defaultForecast;
  const title = weather ? `72-Hour Trajectory: ${weather.name}` : 'Global Focus: India (New Delhi)';

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <h2 className="shine-gold" style={{ fontSize: '2.5rem', marginBottom: '2rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Calendar size={36} color="#ffd700" />
          {title}
        </h2>
        
        {loading ? (
          <div className="glass-panel" style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={48} color="#ffd700" />
          </div>
        ) : !activeWeather || !activeWeather.forecast ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ color: '#ffd700', opacity: 0.6 }}>No trajectory data available.</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {activeWeather.forecast.map((day, index) => {
              // Parse date to readable format
              const dateObj = new Date(day.date);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
              const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={day.date} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <h3 className="shine-gold" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{index === 0 ? 'Today' : dayName}</h3>
                  <p style={{ opacity: 0.6, marginBottom: '1.5rem' }}>{shortDate}</p>
                  
                  <img 
                    src={getWeatherIcon(day.icon)} 
                    alt={day.condition} 
                    style={{ width: '120px', height: '120px', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5)) brightness(1.2)', marginBottom: '1rem' }} 
                  />
                  
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'capitalize' }}>
                    {day.condition}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', borderTop: '1px solid rgba(255,215,0,0.2)', paddingTop: '1.5rem' }}>
                    <div>
                      <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>MAX</p>
                      <p className="shine-gold" style={{ fontSize: '1.8rem', fontWeight: 700 }}>{Math.round(day.maxTemp)}°</p>
                    </div>
                    <div>
                      <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>MIN</p>
                      <p style={{ fontSize: '1.8rem', fontWeight: 700, opacity: 0.8 }}>{Math.round(day.minTemp)}°</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.main>
  );
}

export default Forecast;
