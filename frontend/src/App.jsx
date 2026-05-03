import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Loader2, Compass, Home as HomeIcon, LayoutDashboard, Map as MapIcon, Calendar, Newspaper } from 'lucide-react';
import './index.css';

// Import Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Forecast from './pages/Forecast';
import NewsPage from './pages/NewsPage';
import ChatBot from './components/ChatBot';

// Removed star generation for clean light theme
// Inner app component to use location
function AppContent() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const fetchWeather = async (eOrCityName) => {
    let queryCity = city;
    
    if (eOrCityName && typeof eOrCityName.preventDefault === 'function') {
      eOrCityName.preventDefault();
    } else if (typeof eOrCityName === 'string') {
      queryCity = eOrCityName;
      setCity(eOrCityName);
    }

    if (!queryCity.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/weather?city=${queryCity}`);
      setWeather(response.data);
      // Automatically navigate to dashboard when a new city is successfully searched
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
      navigate('/dashboard'); // Go to dashboard to show error
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    if (iconCode.startsWith('//') || iconCode.startsWith('http')) {
      return iconCode.startsWith('//') ? `https:${iconCode}` : iconCode;
    }
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Animated Gradient & Space Environment combined */}
      <div className="gradient-bg"></div>

      {/* Dashboard Top Navigation - Always visible */}
      <nav className="glass-panel top-nav" style={{ 
        margin: '1.5rem', 
        padding: '1rem 2rem', 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        borderRadius: '16px',
        border: '1px solid rgba(255,215,0,0.2)',
        position: 'relative',
        minHeight: '80px',
        zIndex: 10
      }}>
        {/* Logo */}
        <div className="top-nav-logo" style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={24} color="#2563eb" />
              <h1 className="shine-text" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px', margin: 0 }}>AURA</h1>
            </div>
          </Link>
          <span style={{ fontSize: '0.65rem', color: '#2563eb', letterSpacing: '1px', marginTop: '4px', fontWeight: 600 }}>GLOBAL TELEMETRY & NEWS</span>
        </div>

        {/* Search Bar - Center */}
        <form onSubmit={fetchWeather} className="nav-search-form" style={{ display: 'flex', gap: '0.5rem', width: '100%', minWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Search for a city..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="glass-input"
            style={{ flex: 1, padding: '0.8rem 1.5rem', borderRadius: '50px', fontSize: '1rem' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="glass-input"
            style={{ borderRadius: '50px', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          </button>
        </form>

        {/* Navigation Links - Right */}
        <div className="nav-links-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: location.pathname === '/' ? '#2563eb' : '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s ease', opacity: location.pathname === '/' ? 1 : 0.8 }}>
            <HomeIcon size={18} />
            <span className="nav-link-text">Home</span>
          </Link>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: location.pathname === '/dashboard' ? '#2563eb' : '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s ease', opacity: location.pathname === '/dashboard' ? 1 : 0.8 }}>
            <LayoutDashboard size={18} />
            <span className="nav-link-text">Dashboard</span>
          </Link>
          <Link to="/map" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: location.pathname === '/map' ? '#2563eb' : '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s ease', opacity: location.pathname === '/map' ? 1 : 0.8 }}>
            <MapIcon size={18} />
            <span className="nav-link-text">Map</span>
          </Link>
          <Link to="/forecast" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: location.pathname === '/forecast' ? '#2563eb' : '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s ease', opacity: location.pathname === '/forecast' ? 1 : 0.8 }}>
            <Calendar size={18} />
            <span className="nav-link-text">Forecast</span>
          </Link>
          <Link to="/news" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: location.pathname === '/news' ? '#2563eb' : '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s ease', opacity: location.pathname === '/news' ? 1 : 0.8 }}>
            <Newspaper size={18} />
            <span className="nav-link-text">News</span>
          </Link>
        </div>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<HomePage city={city} setCity={setCity} fetchWeather={fetchWeather} loading={loading} />} />
        <Route path="/dashboard" element={<Dashboard weather={weather} error={error} getWeatherIcon={getWeatherIcon} />} />
        <Route path="/map" element={<MapPage weather={weather} />} />
        <Route path="/forecast" element={<Forecast weather={weather} getWeatherIcon={getWeatherIcon} />} />
        <Route path="/news" element={<NewsPage weather={weather} />} />
      </Routes>
      
      {/* Global AI Chatbot */}
      <ChatBot setCity={setCity} fetchWeather={fetchWeather} weather={weather} error={error} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
