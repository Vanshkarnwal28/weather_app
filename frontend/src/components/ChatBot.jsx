import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ChatBot({ setCity, fetchWeather, weather, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am Aura. I can help you navigate or search for weather telemetry. Try asking "What is the weather in Tokyo?" or "Go to the map".' }
  ]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (weather && weather.name) {
      const temp = Math.round(weather.main?.temp || 0);
      const desc = weather.weather?.[0]?.description || 'unknown conditions';
      const humidity = weather.main?.humidity || 0;
      
      setMessages(prev => {
        const newMsg = `I found it! The current weather in ${weather.name} is ${temp}°C with ${desc}. Humidity is at ${humidity}%. I've also loaded the full telemetry on your dashboard.`;
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.text === newMsg) return prev;
        return [...prev, { sender: 'bot', text: newMsg }];
      });
      if (!isOpen && window.innerWidth > 768) setIsOpen(true);
    }
  }, [weather]);

  useEffect(() => {
    if (error) {
      setMessages(prev => {
        const newMsg = `I'm sorry, I encountered an error: ${error}. Please try a different location.`;
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.text === newMsg) return prev;
        return [...prev, { sender: 'bot', text: newMsg }];
      });
      if (!isOpen && window.innerWidth > 768) setIsOpen(true);
    }
  }, [error]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Simulated Smart Assistant Logic
    setTimeout(() => {
      processCommand(userMsg.toLowerCase());
    }, 600);
  };

  const processCommand = (cmd) => {
    try {
      let botReply = "";
      
      const greetings = ['hi', 'hello', 'hey', 'namaste', 'morning', 'evening', 'sup', 'yo'];
      const maps = ['map', 'globe', 'earth', 'location', 'where'];
      const news = ['news', 'article', 'transmission', 'latest', 'update'];
      const forecast = ['forecast', 'future', 'tomorrow', 'trajectory', 'predict', 'later'];
      const home = ['home', 'landing', 'main', 'start', 'menu', 'back'];
      const dashboard = ['dashboard', 'panel', 'board', 'telemetry'];
      
      const searchTriggers = ['weather in', 'weather of', 'search for', 'search', 'temperature in', 'temperature of', 'how is', 'what about'];
      
      const cmdLower = cmd.toLowerCase();
      
      let isGreeting = greetings.some(word => cmdLower.includes(word));
      let isMap = maps.some(word => cmdLower.includes(word));
      let isNews = news.some(word => cmdLower.includes(word));
      let isForecast = forecast.some(word => cmdLower.includes(word));
      let isHome = home.some(word => cmdLower.includes(word));
      let isDashboard = dashboard.some(word => cmdLower.includes(word));
      
      let cityToSearch = "";
      for (let trigger of searchTriggers) {
        if (cmdLower.includes(trigger)) {
          cityToSearch = cmdLower.split(trigger)[1].trim();
          break;
        }
      }
      
      cityToSearch = cityToSearch.replace(/[?.!]/g, '').trim();

      if (cityToSearch) {
        botReply = `Initializing telemetry search for ${cityToSearch}...`;
        fetchWeather(cityToSearch);
      } else if (isMap) {
        botReply = "Taking you to the Global Telemetry Map now!";
        navigate('/map');
      } else if (isNews) {
        botReply = "Opening localized news transmissions.";
        navigate('/news');
      } else if (isForecast) {
        botReply = "Opening the 72-hour forecast trajectory.";
        navigate('/forecast');
      } else if (isHome) {
        botReply = "Returning to the main terminal.";
        navigate('/');
      } else if (isDashboard) {
        botReply = "Opening your main telemetry dashboard.";
        navigate('/dashboard');
      } else if (isGreeting) {
        botReply = "Hello! How can I assist your atmospheric monitoring today?";
      } else {
        const wordCount = cmdLower.trim().split(/\s+/).length;
        if (wordCount <= 3) {
          let assumedCity = cmdLower.replace(/[?.!]/g, '').trim();
          assumedCity = assumedCity.charAt(0).toUpperCase() + assumedCity.slice(1);
          botReply = `Searching atmospheric data for ${assumedCity}...`;
          fetchWeather(assumedCity);
        } else {
          botReply = "My sensors are still calibrating to understand that command. Try asking me to navigate somewhere, or simply type a city name like 'Tokyo' to initialize a scan.";
        }
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "System Error: " + err.message }]);
    }
  };

  return (
    <div className="chatbot-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="glass-panel chatbot-window"
            style={{ 
              width: '350px', 
              height: '500px', 
              marginBottom: '1rem', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
            }}
          >
            {/* Header */}
            <div style={{ background: '#2563eb', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Bot size={24} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Aura Assistant</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Chat History */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.4)' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender}`} style={{ display: 'flex', flexDirection: 'column' }}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1rem', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '20px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem' }}
              />
              <button 
                type="submit" 
                style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              >
                <Send size={18} style={{ transform: 'translateX(-1px)' }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-trigger glass-panel"
        style={{ 
          width: '65px', 
          height: '65px', 
          borderRadius: '50%', 
          background: '#2563eb', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 10px 25px rgba(37,99,235,0.4)'
        }}
      >
        {isOpen ? <X size={30} /> : <MessageSquare size={30} />}
      </motion.button>
    </div>
  );
}

export default ChatBot;
