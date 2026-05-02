const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      console.error('WEATHER_API_KEY is not defined in .env');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call WeatherAPI.com API (Forecast endpoint includes current weather)
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`
    );

    // Map weatherapi.com response to match the OpenWeatherMap format our frontend expects
    const mappedData = {
      name: response.data.location.name,
      sys: { country: response.data.location.country },
      weather: [{
        description: response.data.current.condition.text,
        icon: response.data.current.condition.icon
      }],
      main: {
        temp: response.data.current.temp_c,
        feels_like: response.data.current.feelslike_c,
        humidity: response.data.current.humidity
      },
      wind: {
        speed: (response.data.current.wind_kph / 3.6).toFixed(1) // Convert kph to m/s
      },
      coord: {
        lat: response.data.location.lat,
        lon: response.data.location.lon
      },
      forecast: response.data.forecast.forecastday.map(day => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon
      }))
    };

    // Try to fetch Local News for the city
    try {
      const newsApiKey = process.env.NEWS_API_KEY;
      if (newsApiKey) {
        const newsResponse = await axios.get(
          `https://newsapi.org/v2/everything?qInTitle=${encodeURIComponent(city)}&sortBy=relevancy&apiKey=${newsApiKey}&language=en&pageSize=15`
        );
        mappedData.news = newsResponse.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.urlToImage,
          source: article.source.name,
          publishedAt: article.publishedAt
        }));
      }
    } catch (newsError) {
      console.error('Failed to fetch news:', newsError.response?.data || newsError.message);
      mappedData.news = []; // Return empty array if news fails so weather still works
    }

    res.json(mappedData);
  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

// Standalone News Route (For when no city is searched)
app.get('/api/news', async (req, res) => {
  try {
    const { country = 'in', q = 'India' } = req.query;
    const newsApiKey = process.env.NEWS_API_KEY;
    
    if (!newsApiKey) {
      return res.status(500).json({ error: 'NEWS_API_KEY is not defined' });
    }

    // Fetch top headlines for India (using everything endpoint since top-headlines might be restricted on free tier)
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=relevancy&apiKey=${newsApiKey}&language=en&pageSize=15`
    );

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));

    res.json({ articles });
  } catch (error) {
    console.error('Error fetching standalone news:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
