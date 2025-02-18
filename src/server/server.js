var path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fetch = require('node-fetch');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post('/analyze-from-api', async (req, res) => {
    const { locationName, date } = req.body;

    const weatherApiKey = process.env.weatherApiKey;
    const geonamesUsername = process.env.geonamesUsername;
    const pixabayApiKey = process.env.pixabayApiKey;

    if (!weatherApiKey || !geonamesUsername || !pixabayApiKey) {
        return res.status(500).json({ error: 'Missing API keys in environment variables' });
    }

    try {
        // Calculate time remaining for the travel
        const travelDate = new Date(date);
        const today = new Date();
        const timeRemaining = Math.ceil((travelDate - today) / (1000 * 60 * 60 * 24));  // Days remaining

        // Fetch GeoNames data
        const geoResponse = await fetch(`http://api.geonames.org/searchJSON?q=${encodeURIComponent(locationName)}&maxRows=1&username=${geonamesUsername}`);
        
        if (!geoResponse.ok) {
            throw new Error('GeoNames API error');
        }
        const geoData = await geoResponse.json();

        if (geoData && geoData.geonames && geoData.geonames.length > 0) {
            const geoInfo = geoData.geonames[0];
            const { lat, lng } = geoInfo;
            const population = geoInfo.population;

            // Fetch weather data using lat/lng
            const weatherResponse = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${weatherApiKey}&units=M`);
            
            if (!weatherResponse.ok) {
                throw new Error('Weatherbit API error');
            }
            const weatherData = await weatherResponse.json();

            let weatherInfo = 'Weather data not available.';
            if (weatherData && weatherData.data && weatherData.data.length > 0) {
                const weather = weatherData.data[0];
                weatherInfo = `Weather: ${weather.temp}°C, ${weather.weather.description}`;
            }

            // Fetch Pixabay image
            const pixabayResponse = await fetch(`https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(locationName)}&image_type=photo`);
            
            if (!pixabayResponse.ok) {
                throw new Error('Pixabay API error');
            }
            const imageData = await pixabayResponse.json();

            let imageUrl = 'Image not available.';
            if (imageData && imageData.hits && imageData.hits.length > 0) {
                imageUrl = imageData.hits[0].webformatURL;
            }

            // Send the response
            res.json({
                population,
                weather: weatherInfo,
                imageUrl,
                timeRemaining,
            });
        } else {
            res.status(404).json({ error: 'Location not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from APIs', details: error.message });
    }
});

// Start the server on port 4200
app.listen(4200, function () {
    console.log('Server listening on port 4200!');
});
