import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';
import axios from 'axios';

function NewsPage({ weather }) {
  const [defaultNews, setDefaultNews] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we already have weather news, we don't need to fetch default news
    if (weather && weather.news) return;

    const fetchDefaultNews = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${apiUrl}/api/news`);
        setDefaultNews(res.data.articles);
      } catch (err) {
        console.error('Failed to fetch default news', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultNews();
  }, [weather]);

  const newsData = weather && weather.news ? weather.news : defaultNews;
  const title = weather ? `Local Transmissions: ${weather.name}` : 'Global Transmissions: India Focus';

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <h2 className="shine-blue" style={{ fontSize: '2.5rem', marginBottom: '2rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '1rem', textTransform: 'uppercase' }}>
          <Newspaper size={36} color="#2563eb" />
          {title}
        </h2>
        
        {loading ? (
          <div className="glass-panel" style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={48} color="#2563eb" />
          </div>
        ) : !newsData || newsData.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ color: '#2563eb', opacity: 0.6 }}>No recent transmissions found.</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {newsData.map((article, index) => {
              const pubDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <a 
                  key={index} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-panel news-card" 
                  style={{ display: 'flex', padding: '1.5rem', gap: '2rem', textDecoration: 'none', color: '#0f172a', alignItems: 'center', transition: 'all 0.3s ease', border: '1px solid rgba(0,0,0,0.05)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.01)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'; }}
                >
                  {article.imageUrl && (
                    <img 
                      src={article.imageUrl} 
                      alt="News thumbnail" 
                      className="news-image"
                      style={{ width: '200px', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.9rem', color: '#2563eb' }}>
                      <span className="shine-blue" style={{ fontWeight: 600 }}>{article.source}</span>
                      <span style={{ color: '#64748b' }}>{pubDate}</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: 1.3 }}>{article.title}</h3>
                    <p style={{ opacity: 0.8, lineHeight: 1.5 }}>{article.description}</p>
                  </div>
                  <ExternalLink size={24} color="#2563eb" style={{ opacity: 0.5 }} />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.main>
  );
}

export default NewsPage;
