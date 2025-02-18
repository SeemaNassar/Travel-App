// formHandler.js

import { saveTicket, loadTickets } from './ticketStorage.js';

document.addEventListener('DOMContentLoaded', function () {
    // Load saved tickets from localStorage
    loadTickets();

    document.getElementById('input-form').addEventListener('submit', handleFormSubmit);
});

// Handle form submission
export function handleFormSubmit(event) {
    event.preventDefault();

    document.getElementById('output-section').style.display = 'block';
    const date = document.getElementById('date').value;
    const locationInput = document.getElementById('country').value.trim();
    const [city, country] = parseLocation(locationInput);

    // Send data to server via POST request
    fetch('http://localhost:4200/analyze-from-api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            locationName: locationInput,
            date: date
        }),
    })
        .then(response => response.json())
        .then(data => {
            // Display the response data
            document.getElementById('population').textContent = `Population: ${data.population}`;
            document.getElementById('weather').textContent = `Weather: ${data.weather}`;
            document.getElementById('capital-photo').src = data.imageUrl;
            document.getElementById('capital-photo').alt = `Photo of ${city || locationInput}`;
            document.getElementById('time-remaining').textContent = `Days until travel: ${data.timeRemaining}`;

            // Save ticket to localStorage with all necessary data
            const ticket = {
                country: locationInput,
                date: date,
                population: data.population,
                weather: data.weather,
                imageUrl: data.imageUrl,
                timeRemaining: data.timeRemaining
            };
            saveTicket(ticket);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Helper function to parse country and city
export function parseLocation(location) {
    const parts = location.split(',').map(part => part.trim());
    if (parts.length === 2) {
        return [parts[1], parts[0]];
    }
    return [parts[0], ''];
}
